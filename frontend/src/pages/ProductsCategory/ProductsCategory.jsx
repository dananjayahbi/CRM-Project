import React, { useState, useEffect } from "react";
import { Space, Table, Button, ConfigProvider, Input, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import NewProductsCategoryModal from "./NewProductsCategoryModal";
import EditProductsCategoryModal from "./EditProductsCategoryModal";
import DeleteProductsCategoryModal from "./DeleteProductsCategoryModal";

const { Search } = Input;

const ProductsCategory = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [productsCategory, setProductsCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [newProductsCategoryModalVisible, setNewProductsCategoryModalVisible] =
    useState(false);
  const [
    editProductsCategoryModalVisible,
    setEditProductsCategoryModalVisible,
  ] = useState(false);
  const [selectedProductCategoryId, setSelectedProductCategoryId] = useState(
    {}
  );
  const [
    deleteProductsCategoryModalVisible,
    setDeleteProductsCategoryModalVisible,
  ] = useState(false);

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

  // Fetch all products category from the server
  const fetchProductsCategory = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/productsCategories/getAllProductCategories"
      );
      setProductsCategory(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsCategory();
  }, []);

  // Hnadle New Products Category Button
  const handleNewProductsCategory = () => {
    setNewProductsCategoryModalVisible(true);
  };

  // Close New Products Category Modal
  const handleCancelNewProductsCategory = () => {
    setNewProductsCategoryModalVisible(false);
  };

  // On Add New Products Category
  const handleAddProductsCategory = () => {
    setNewProductsCategoryModalVisible(false);
    fetchProductsCategory();
  };

  // Handle Edit Products Category Button
  const handleEditProductsCategory = (record) => {
    setSelectedProductCategoryId(record._id);
    setEditProductsCategoryModalVisible(true);
  };

  // Close Edit Products Category Modal
  const handleCancelEditProductsCategory = () => {
    setEditProductsCategoryModalVisible(false);
    setSelectedProductCategoryId({});
  };

  // On Edit Products Category
  const handleEditProductsCategorySave = () => {
    setEditProductsCategoryModalVisible(false);
    setSelectedProductCategoryId({});
    fetchProductsCategory();
  };

  // Handle Delete Products Category Button
  const handleDeleteProductsCategory = (record) => {
    setSelectedProductCategoryId(record._id);
    setDeleteProductsCategoryModalVisible(true);
  };

  // Close Delete Products Category Modal
  const handleCancelDeleteProductsCategory = () => {
    setDeleteProductsCategoryModalVisible(false);
  };

  // On Delete Products Category
  const handleDeleteProductsCategorySave = () => {
    setDeleteProductsCategoryModalVisible(false);
    fetchProductsCategory();
  };

  // Search Functionality
  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  // Filter products category based on search text
  const filteredProductsCategory = productsCategory.filter((productCategory) =>
    productCategory.name.toLowerCase().includes(searchText)
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
          <Button
            type="primary"
            onClick={() => handleEditProductsCategory(record)}
          >
            Edit
          </Button>
          <Button
            danger
            onClick={() => handleDeleteProductsCategory(record)}
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
        <b>name:</b> {record.name}
      </p>
      <p>
        <b>description:</b> {record.description}
      </p>
      <Space size="middle" style={{ marginTop: "10px" }}>
        <Button
          type="primary"
          onClick={() => handleEditProductsCategory(record)}
        >
          Edit
        </Button>
        <Button
          danger
          onClick={() => handleDeleteProductsCategory(record)}
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
            Products Category List ({filteredProductsCategory.length})
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <Button type="primary" onClick={handleNewProductsCategory}>
              New Product Category
            </Button>
            <div style={{ display: "flex", gap: "10px" }}>
              <Search
                placeholder="Search categories"
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
                dataSource={filteredProductsCategory}
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
          <NewProductsCategoryModal
            visible={newProductsCategoryModalVisible}
            onCancel={handleCancelNewProductsCategory}
            onAdd={handleAddProductsCategory}
          />
          <EditProductsCategoryModal
            visible={editProductsCategoryModalVisible}
            onCancel={handleCancelEditProductsCategory}
            onEdit={handleEditProductsCategorySave}
            selectedProductCategoryId={selectedProductCategoryId}
          />
          <DeleteProductsCategoryModal
            visible={deleteProductsCategoryModalVisible}
            onCancel={handleCancelDeleteProductsCategory}
            onDelete={handleDeleteProductsCategorySave}
            selectedProductCategoryId={selectedProductCategoryId}
          />
        </div>
      )}
    </>
  );
};

export default ProductsCategory;
