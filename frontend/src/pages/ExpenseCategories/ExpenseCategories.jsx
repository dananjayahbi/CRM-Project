import React, { useState, useEffect } from "react";
import { Space, Table, Button, ConfigProvider, Input, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import NewExpenseCategoryModal from "./NewExpenseCategoryModal";
import EditExpenseCategoryModal from "./EditExpenseCategoryModal";
import DeleteExpenseCategoryModal from "./DeleteExpenseCategoryModal";

const { Search } = Input;

const ExpenseCategories = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [newExpenseCategoryModalVisible, setNewExpenseCategoryModalVisible] =
    useState(false);
  const [editExpenseCategoryModalVisible, setEditExpenseCategoryModalVisible] =
    useState(false);
  const [selectedExpenseCategoryId, setSelectedExpenseCategoryId] = useState(
    {}
  );
  const [
    deleteExpenseCategoryModalVisible,
    setDeleteExpenseCategoryModalVisible,
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

  // Fetch all expense categories from the server
  const fetchExpenseCategories = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/expenseCategories/getAllExpenseCategories"
      );
      setExpenseCategories(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenseCategories();
  }, []);

  // Hnadle New Expense Category Button
  const handleNewExpenseCategory = () => {
    setNewExpenseCategoryModalVisible(true);
  };

  // Close New Expense Category Modal
  const closeNewExpenseCategoryModal = () => {
    setNewExpenseCategoryModalVisible(false);
  };

  // On Add New Expense Category
  const onAddNewExpenseCategory = (expenseCategory) => {
    setNewExpenseCategoryModalVisible;
    fetchExpenseCategories();
  };

  // Handle Edit Expense Category Button
  const handleEditExpenseCategory = (record) => {
    setSelectedExpenseCategoryId(record._id);
    setEditExpenseCategoryModalVisible(true);
  };

  // Close Edit Expense Category Modal
  const closeEditExpenseCategoryModal = () => {
    setEditExpenseCategoryModalVisible(false);
    setSelectedExpenseCategoryId({});
  };

  // On Edit Expense Category
  const onEditExpenseCategory = () => {
    setEditExpenseCategoryModalVisible(false);
    setSelectedExpenseCategoryId({});
    fetchExpenseCategories();
  };

  // Handle Delete Expense Category Button
  const handleDeleteExpenseCategory = (record) => {
    setSelectedExpenseCategoryId(record._id);
    setDeleteExpenseCategoryModalVisible(true);
  };

  // Close Delete Expense Category Modal
  const closeDeleteExpenseCategoryModal = () => {
    setDeleteExpenseCategoryModalVisible(false);
  };

  // On Delete Expense Category
  const onDeleteExpenseCategory = () => {
    setDeleteExpenseCategoryModalVisible(false);
    fetchExpenseCategories();
  };

  // Search Functionality
  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  // Filter expense categories based on search text
  const filteredExpenseCategories = expenseCategories.filter(
    (expenseCategory) =>
      expenseCategory.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
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
            onClick={() => handleEditExpenseCategory(record)}
          >
            Edit
          </Button>
          <Button
            danger
            onClick={() => handleDeleteExpenseCategory(record)}
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
        <Button
          type="primary"
          onClick={() => handleEditExpenseCategory(record)}
        >
          Edit
        </Button>
        <Button
          danger
          onClick={() => handleDeleteExpenseCategory(record)}
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
            Expense Categories List ({filteredExpenseCategories.length})
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <Button type="primary" onClick={handleNewExpenseCategory}>
              New Category
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
                dataSource={filteredExpenseCategories}
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
          <NewExpenseCategoryModal
            visible={newExpenseCategoryModalVisible}
            onCancel={closeNewExpenseCategoryModal}
            onAdd={onAddNewExpenseCategory}
          />
          <EditExpenseCategoryModal
            visible={editExpenseCategoryModalVisible}
            onCancel={closeEditExpenseCategoryModal}
            selectedExpenseCategoryId={selectedExpenseCategoryId}
            onEdit={onEditExpenseCategory}
          />
          <DeleteExpenseCategoryModal
            visible={deleteExpenseCategoryModalVisible}
            onCancel={closeDeleteExpenseCategoryModal}
            selectedExpenseCategoryId={selectedExpenseCategoryId}
            onDelete={onDeleteExpenseCategory}
          />
        </div>
      )}
    </>
  );
};

export default ExpenseCategories;
