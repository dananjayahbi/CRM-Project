import React, { useState, useEffect } from "react";
import {
  Space,
  Table,
  Button,
  ConfigProvider,
  Input,
  Spin,
  DatePicker,
  Avatar,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import NewProductModal from "./NewProductModal";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";

const { Search } = Input;

const Products = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [newProductModalVisible, setNewProductModalVisible] = useState(false);
  const [editProductModalVisible, setEditProductModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState({});
  const [deleteProductModalVisible, setDeleteProductModalVisible] =
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

  // Fetch all products from the server
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/products/getAllProducts"
      );
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle New Product modal Button
  const handleNewProduct = () => {
    setNewProductModalVisible(true);
  };

  // Cancel New Product modal
  const handleCancelNewProduct = () => {
    setNewProductModalVisible(false);
  };

  // On Add New Product
  const handleAddNewProduct = () => {
    setNewProductModalVisible(false);
    fetchProducts();
  };

  // Handle Edit Product Button
  const handleEditProduct = (record) => {
    setSelectedProductId(record._id);
    setEditProductModalVisible(true);
  };

  // Close Edit Product Modal
  const handleCancelEditProduct = () => {
    setEditProductModalVisible(false);
    setSelectedProductId({});
  };

  // On Edit Product
  const handleEditProductSave = () => {
    setEditProductModalVisible(false);
    setSelectedProductId({});
    fetchProducts();
  };

  // Handle Delete Product Button
  const handleDeleteProduct = (record) => {
    setSelectedProductId(record._id);
    setDeleteProductModalVisible(true);
  };

  // Close Delete Product Modal
  const handleCancelDeleteProduct = () => {
    setDeleteProductModalVisible(false);
    setSelectedProductId({});
  };

  // On Delete Product
  const handleDeleteProductSave = () => {
    setDeleteProductModalVisible(false);
    setSelectedProductId({});
    fetchProducts();
  };

  // Search Functionality
  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  // Filter products based on search text
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText)
  );

  const columns = [
    {
      title: "Product Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 70,
      render: (imageUrl) => (
        <Avatar
          shape="square"
          size={64}
          src={"http://localhost:3000" + imageUrl}
        />
      ),
    },
    {
      title: "Product Code",
      dataIndex: "productCode",
      key: "productCode",
      sorter: (a, b) => a.productCode.localeCompare(b.productCode),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "Purchase Price",
      dataIndex: "purchasePrice",
      key: "purchasePrice",
    },
    {
      title: "Final Sales Price",
      dataIndex: "finalPrice",
      key: "finalPrice",
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEditProduct(record)}>
            Edit
          </Button>
          <Button
            danger
            onClick={() => handleDeleteProduct(record)}
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
        <b>Brand:</b> {record.brand}
      </p>
      <p>
        <b>Category:</b> {record.category}
      </p>
      <p>
        <b>Unit:</b> {record.unit}
      </p>
      <p>
        <b>Purchase Price:</b> {record.purchasePrice}
      </p>
      <p>
        <b>Final Sales Price:</b> {record.finalPrice}
      </p>
      <p>
        <b>Tax:</b> {record.tax}
      </p>
      <Space size="middle" style={{ marginTop: "10px" }}>
        <Button type="primary" onClick={() => handleEditExpense(record)}>
          Edit
        </Button>
        <Button
          danger
          onClick={() => handleDeleteExpense(record)}
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
            Products List ({filteredProducts.length})
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <Button type="primary" onClick={handleNewProduct}>
              New Product
            </Button>
            <div style={{ display: "flex", gap: "10px" }}>
              <Search
                placeholder="Search by product name"
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
                dataSource={filteredProducts}
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
          <NewProductModal
            visible={newProductModalVisible}
            onCancel={handleCancelNewProduct}
            onAdd={handleAddNewProduct}
          />
          <EditProductModal
            visible={editProductModalVisible}
            onCancel={handleCancelEditProduct}
            onEdit={handleEditProductSave}
            selectedProductId={selectedProductId}
          />
          <DeleteProductModal
            visible={deleteProductModalVisible}
            onCancel={handleCancelDeleteProduct}
            onDelete={handleDeleteProductSave}
            selectedProductId={selectedProductId}
          />
        </div>
      )}
    </>
  );
};

export default Products;
