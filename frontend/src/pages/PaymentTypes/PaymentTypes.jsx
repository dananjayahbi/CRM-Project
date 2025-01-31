import React, { useState, useEffect } from "react";
import { Space, Table, Button, ConfigProvider, Input, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import NewPaymentTypeModal from "./NewPaymentTypeModal";
import EditPaymentTypeModal from "./EditPaymentTypeModal";
import DeletePaymentTypeModal from "./DeletePaymentTypeModal";

const { Search } = Input;

const PaymentTypes = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [newPaymentTypeModalVisible, setNewPaymentTypeModalVisible] =
    useState(false);
  const [editPaymentTypeModalVisible, setEditPaymentTypeModalVisible] =
    useState(false);
  const [selectedPaymentTypeId, setSelectedPaymentTypeId] = useState({});
  const [deletePaymentTypeModalVisible, setDeletePaymentTypeModalVisible] =
    useState(false);

  const theme = {
    components: {
      Table: {
        headerBg: "#ededed",
      },
    },
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch all payment types from the server
  const fetchPaymentTypes = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/paymentTypes/getAllPaymentTypes"
      );
      setPaymentTypes(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentTypes();
  }, []);

  // Hnadle New Payment Type Button
  const handleNewPaymentType = () => {
    setNewPaymentTypeModalVisible(true);
  };

  // Close New Payment Type Modal
  const handleCancelNewPaymentType = () => {
    setNewPaymentTypeModalVisible(false);
  };

  // On Add New Payment Type
  const handleAddPaymentType = () => {
    setNewPaymentTypeModalVisible(false);
    fetchPaymentTypes();
  };

  // Handle Edit Payment Type Button
  const handleEditPaymentType = (record) => {
    setSelectedPaymentTypeId(record._id);
    setEditPaymentTypeModalVisible(true);
  };

  // Close Edit Payment Type Modal
  const handleCancelEditPaymentType = () => {
    setEditPaymentTypeModalVisible(false);
    setSelectedPaymentTypeId({});
  };

  // On Edit Payment Type
  const handleEditPaymentTypeSave = () => {
    setEditPaymentTypeModalVisible(false);
    setSelectedPaymentTypeId({});
    fetchPaymentTypes();
  };

  // Handle Delete Payment Type Button
  const handleDeletePaymentType = (record) => {
    setSelectedPaymentTypeId(record._id);
    setDeletePaymentTypeModalVisible(true);
  };

  // Close Delete Payment Type Modal
  const handleCancelDeletePaymentType = () => {
    setDeletePaymentTypeModalVisible(false);
  };

  // On Delete Payment Type
  const handleDeletePaymentTypeSave = () => {
    setDeletePaymentTypeModalVisible(false);
    fetchPaymentTypes();
  };

  // Search Functionality
  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  // Filter payment types based on search text
  const filteredPaymentTypes = paymentTypes.filter((paymentType) =>
    paymentType.name.toLowerCase().includes(searchText)
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEditPaymentType(record)}>
            Edit
          </Button>
          <Button
            danger
            onClick={() => handleDeletePaymentType(record)}
            style={{ marginLeft: "-10px" }}
          >
            Delete
          </Button>
        </Space>
      ),
      responsive: ["lg"],
    },
  ];

  const expandedRowRender = (record) => (
    <div>
      <Space size="middle" style={{ marginTop: "10px" }}>
        <Button type="primary" onClick={() => handleEditPaymentType(record)}>
          Edit
        </Button>
        <Button
          danger
          onClick={() => handleDeletePaymentType(record)}
          style={{ marginLeft: "-10px" }}
        >
          Delete
        </Button>
      </Space>
    </div>
  );

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
          }}
        >
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      ) : (
        <div>
          <p
            style={{
              textAlign: "left",
              fontSize: "30px",
              fontWeight: 500,
              margin: "-40px 0 0 0",
            }}
          >
            Payment Types List ({filteredPaymentTypes.length})
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <Button type="primary" onClick={handleNewPaymentType}>
              New Payment Type
            </Button>
            <div style={{ display: "flex", gap: "10px" }}>
              <Search
                placeholder="Search payment Types"
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 200 }}
              />
            </div>
          </div>
          <ConfigProvider theme={theme}>
            <div style={{ maxWidth: "100%", overflowX: "auto" }}>
              <Table
                columns={columns}
                dataSource={filteredPaymentTypes}
                loading={loading}
                expandable={{
                  expandedRowRender: expandedRowRender,
                  rowExpandable: (record) =>
                    windowWidth < 1000 && record.name !== "Not Expandable",
                }}
                rowKey="_id"
              />
            </div>
          </ConfigProvider>
          <NewPaymentTypeModal
            visible={newPaymentTypeModalVisible}
            onCancel={handleCancelNewPaymentType}
            onAdd={handleAddPaymentType}
          />
          <EditPaymentTypeModal
            visible={editPaymentTypeModalVisible}
            onCancel={handleCancelEditPaymentType}
            onEdit={handleEditPaymentTypeSave}
            selectedPaymentTypeId={selectedPaymentTypeId}
          />
          <DeletePaymentTypeModal
            visible={deletePaymentTypeModalVisible}
            onCancel={handleCancelDeletePaymentType}
            onDelete={handleDeletePaymentTypeSave}
            selectedPaymentTypeId={selectedPaymentTypeId}
          />
        </div>
      )}
    </>
  );
};

export default PaymentTypes;
