import React, { useState, useEffect } from "react";
import { Space, Table, Button, ConfigProvider, Input, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import NewSupplierModal from "./NewSupplierModal";
import EditSupplierModal from "./EditSupplierModal";
import DeleteSupplierModal from "./DeleteSupplierModal";

const { Search } = Input;

const Suppliers = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [newSupplierModalVisible, setNewSupplierModalVisible] = useState(false);
  const [editSupplierModalVisible, setEditSupplierModalVisible] =
    useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState({});
  const [deleteSupplierModalVisible, setDeleteSupplierModalVisible] =
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

  // Fetch all suppliers from the server
  const fetchSuppliers = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/suppliers/getAllSuppliers"
      );
      setSuppliers(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Hnadle New Supplier Button
  const handleNewSupplier = () => {
    setNewSupplierModalVisible(true);
  };

  // Close New Supplier Modal
  const handleCancelNewSupplier = () => {
    setNewSupplierModalVisible(false);
  };

  // On Add New Supplier
  const handleAddSupplier = () => {
    setNewSupplierModalVisible(false);
    fetchSuppliers();
  };

  // Handle Edit Supplier Button
  const handleEditSupplier = (record) => {
    setSelectedSupplierId(record._id);
    setEditSupplierModalVisible(true);
  };

  // Close Edit Supplier Modal
  const handleCancelEditSupplier = () => {
    setEditSupplierModalVisible(false);
    setSelectedSupplierId({});
  };

  // On Edit Supplier
  const handleEditSupplierSave = () => {
    setEditSupplierModalVisible(false);
    setSelectedSupplierId({});
    fetchSuppliers();
  };

  // Handle Delete Supplier Button
  const handleDeleteSupplier = (record) => {
    setSelectedSupplierId(record._id);
    setDeleteSupplierModalVisible(true);
  };

  // Close Delete Supplier Modal
  const handleCancelDeleteSupplier = () => {
    setDeleteSupplierModalVisible(false);
  };

  // On Delete Supplier
  const handleDeleteSupplierSave = () => {
    setDeleteSupplierModalVisible(false);
    fetchSuppliers();
  };

  // Search Functionality
  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  // Filter the suppliers based on the search text
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchText) ||
      supplier.email.toLowerCase().includes(searchText) ||
      supplier.mobile.toLowerCase().includes(searchText) ||
      supplier.address.toLowerCase().includes(searchText)
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["md"],
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      responsive: ["md"],
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      responsive: ["md"],
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEditSupplier(record)}>
            Edit
          </Button>
          <Button
            danger
            onClick={() => handleDeleteSupplier(record)}
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
      <p>
        <b>Email:</b> {record.email}
      </p>
      <p>
        <b>Mobile:</b> {record.mobile}
      </p>
      <p>
        <b>Address:</b> {record.address}
      </p>
      <Space size="middle" style={{ marginTop: "10px" }}>
        <Button type="primary" onClick={() => handleEditSupplier(record)}>
          Edit
        </Button>
        <Button
          danger
          onClick={() => handleDeleteSupplier(record)}
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
            Suppliers List ({filteredSuppliers.length})
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <Button type="primary" onClick={handleNewSupplier}>
              New Supplier
            </Button>
            <div style={{ display: "flex", gap: "10px" }}>
              <Search
                placeholder="Search users"
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
                dataSource={filteredSuppliers}
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
          <NewSupplierModal
            visible={newSupplierModalVisible}
            onCancel={handleCancelNewSupplier}
            onAdd={handleAddSupplier}
          />
          <EditSupplierModal
            visible={editSupplierModalVisible}
            onCancel={handleCancelEditSupplier}
            onEdit={handleEditSupplierSave}
            selectedSupplierId={selectedSupplierId}
          />
          <DeleteSupplierModal
            visible={deleteSupplierModalVisible}
            onCancel={handleCancelDeleteSupplier}
            onDelete={handleDeleteSupplierSave}
            selectedSupplierId={selectedSupplierId}
          />
        </div>
      )}
    </>
  );
};

export default Suppliers;
