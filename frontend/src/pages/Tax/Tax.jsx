import React, { useState, useEffect } from "react";
import { Space, Table, Button, ConfigProvider, Input, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import NewTaxModal from "./NewTaxModal";
import EditTaxModal from "./EditTaxModal";
import DeleteTaxModal from "./DeleteTaxModal";

const { Search } = Input;

const Tax = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [newTaxModalVisible, setNewTaxModalVisible] = useState(false);
  const [editTaxModalVisible, setEditTaxModalVisible] = useState(false);
  const [selectedTaxId, setSelectedTaxId] = useState({});
  const [deleteTaxModalVisible, setDeleteTaxModalVisible] = useState(false);

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

  // Fetch all taxes from the server
  const fetchTaxes = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/taxes/getAllTaxes"
      );
      setTaxes(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxes();
  }, []);

  // Hnadle New Tax Button
  const handleNewTax = () => {
    setNewTaxModalVisible(true);
  };

  // Close New Tax Modal
  const handleCancelNewTax = () => {
    setNewTaxModalVisible(false);
  };

  // On Add New Tax
  const handleAddTax = () => {
    setNewTaxModalVisible(false);
    fetchTaxes();
  };

  // Handle Edit Tax Button
  const handleEditTax = (record) => {
    setSelectedTaxId(record._id);
    setEditTaxModalVisible(true);
  };

  // Close Edit Tax Modal
  const handleCancelEditTax = () => {
    setEditTaxModalVisible(false);
    setSelectedTaxId({});
  };

  // On Edit Tax
  const handleEditTaxSave = () => {
    setEditTaxModalVisible(false);
    setSelectedTaxId({});
    fetchTaxes();
  };

  // Handle Delete Tax Button
  const handleDeleteTax = (record) => {
    setSelectedTaxId(record._id);
    setDeleteTaxModalVisible(true);
  };

  // Close Delete Tax Modal
  const handleCancelDeleteTax = () => {
    setDeleteTaxModalVisible(false);
  };

  // On Delete Tax
  const handleDeleteTaxSave = () => {
    setDeleteTaxModalVisible(false);
    fetchTaxes();
  };

  // Search Functionality
  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  // Filter taxes based on search text
  const filteredTaxes = taxes.filter(
    (tax) =>
      tax.taxName.toLowerCase().includes(searchText) ||
      tax.taxRate.toString().includes(searchText)
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "taxName",
      key: "taxName",
    },
    {
      title: "Rate (%)",
      dataIndex: "taxRate",
      key: "taxRate",
      responsive: ["md"],
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEditTax(record)}>
            Edit
          </Button>
          <Button
            danger
            onClick={() => handleDeleteTax(record)}
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
        <b>Name:</b> {record.taxName}
      </p>
      <p>
        <b>Rate:</b> {record.taxRate}
      </p>
      <Space size="middle" style={{ marginTop: "10px" }}>
        <Button type="primary" onClick={() => handleEditTax(record)}>
          Edit
        </Button>
        <Button
          danger
          onClick={() => handleDeleteTax(record)}
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
            Tax List ({filteredTaxes.length})
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <Button type="primary" onClick={handleNewTax}>
              New Tax
            </Button>
            <div style={{ display: "flex", gap: "10px" }}>
              <Search
                placeholder="Search Taxes"
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
                dataSource={filteredTaxes}
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
          <NewTaxModal
            visible={newTaxModalVisible}
            onCancel={handleCancelNewTax}
            onAdd={handleAddTax}
          />
          <EditTaxModal
            visible={editTaxModalVisible}
            onCancel={handleCancelEditTax}
            onEdit={handleEditTaxSave}
            selectedTaxId={selectedTaxId}
          />
          <DeleteTaxModal
            visible={deleteTaxModalVisible}
            onCancel={handleCancelDeleteTax}
            onDelete={handleDeleteTaxSave}
            selectedTaxId={selectedTaxId}
          />
        </div>
      )}
    </>
  );
};

export default Tax;
