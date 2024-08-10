import React, { useState, useEffect } from "react";
import { Space, Table, Button, ConfigProvider, Input, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import NewBrandModal from "./NewBrandModal";
import EditBrandModal from "./EditBrandModal";
import DeleteBrandModal from "./DeleteBrandModal";

const { Search } = Input;

const Brands = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [newBrandModalVisible, setNewBrandModalVisible] = useState(false);
  const [editBrandModalVisible, setEditBrandModalVisible] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState({});
  const [deleteBrandModalVisible, setDeleteBrandModalVisible] = useState(false);

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

  // Fetch all brands from the server
  const fetchBrands = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/brands/getAllBrands"
      );
      setBrands(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Hnadle New Brand Button
  const handleNewBrand = () => {
    setNewBrandModalVisible(true);
  };

  // Close New Brand Modal
  const closeNewBrandModal = () => {
    setNewBrandModalVisible(false);
  };

  // On Add New Brand
  const handleAddBrand = () => {
    setNewBrandModalVisible(false);
    fetchBrands();
  };

  // Handle Edit Brand Button
  const handleEditBrand = (record) => {
    setSelectedBrandId(record._id);
    setEditBrandModalVisible(true);
  };

  // Close Edit Brand Modal
  const closeEditBrandModal = () => {
    setEditBrandModalVisible(false);
    setSelectedBrandId({});
  };

  // On Edit Brand
  const handleEdit = () => {
    setEditBrandModalVisible(false);
    setSelectedBrandId({});
    fetchBrands();
  };

  // Handle Delete Brand Button
  const handleDeleteBrand = (record) => {
    setSelectedBrandId(record._id);
    setDeleteBrandModalVisible(true);
  };

  // Close Delete Brand Modal
  const closeDeleteBrandModal = () => {
    setDeleteBrandModalVisible(false);
  };

  // On Delete Brand
  const handleDelete = () => {
    setDeleteBrandModalVisible(false);
    fetchBrands();
  };

  // Search Functionality
  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  // Filter brands based on search text
  const filteredBrands = brands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(searchText) ||
      brand.description.toLowerCase().includes(searchText)
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      responsive: ["md"],
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEditBrand(record)}>
            Edit
          </Button>
          <Button
            danger
            onClick={() => handleDeleteBrand(record)}
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
        <b>Name:</b> {record.name}
      </p>
      <p>
        <b>Description:</b> {record.description}
      </p>
      <Space size="middle" style={{ marginTop: "10px" }}>
        <Button type="primary" onClick={() => handleEditBrand(record)}>
          Edit
        </Button>
        <Button
          danger
          onClick={() => handleDeleteBrand(record)}
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
            Brands List ({filteredBrands.length})
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <Button type="primary" onClick={handleNewBrand}>
              New Brand
            </Button>
            <div style={{ display: "flex", gap: "10px" }}>
              <Search
                placeholder="Search brand"
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
                dataSource={filteredBrands}
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
          <NewBrandModal
            visible={newBrandModalVisible}
            onCancel={closeNewBrandModal}
            onAdd={handleAddBrand}
          />
          <EditBrandModal
            visible={editBrandModalVisible}
            onCancel={closeEditBrandModal}
            onEdit={handleEdit}
            selectedBrandId={selectedBrandId}
          />
          <DeleteBrandModal
            visible={deleteBrandModalVisible}
            onCancel={closeDeleteBrandModal}
            onDelete={handleDelete}
            selectedBrandId={selectedBrandId}
          />
        </div>
      )}
    </>
  );
};

export default Brands;
