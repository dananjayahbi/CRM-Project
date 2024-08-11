import React, { useState, useEffect } from "react";
import {
  Space,
  Table,
  Button,
  ConfigProvider,
  Input,
  Spin,
  DatePicker,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import NewExpenseModal from "./NewExpenseModal";
import EditExpenseModal from "./EditExpenseModal";
import DeleteExpenseModal from "./DeleteExpenseModal";

const { Search } = Input;
const { RangePicker } = DatePicker;

const Expenses = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [newExpenseModalVisible, setNewExpenseModalVisible] = useState(false);
  const [editExpenseModalVisible, setEditExpenseModalVisible] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState({});
  const [deleteExpenseModalVisible, setDeleteExpenseModalVisible] =
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

  // Fetch all expenses from the server
  const fetchExpenses = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/expenses/getAllExpenses"
      );
      setExpenses(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Hnadle New Expense Button
  const handleNewExpense = () => {
    setNewExpenseModalVisible(true);
  };

  // Cancel New Expense Modal
  const handleCancelNewExpense = () => {
    setNewExpenseModalVisible(false);
  };

  // On Add New Expense
  const handleAddNewExpense = () => {
    setNewExpenseModalVisible(false);
    fetchExpenses();
  };

  // Handle Edit Expense Button
  const handleEditExpense = (record) => {
    setSelectedExpenseId(record._id);
    setEditExpenseModalVisible(true);
  };

  // Close Edit Expense Modal
  const handleCancelEditExpense = () => {
    setEditExpenseModalVisible(false);
    setSelectedExpenseId({});
  };

  // On Edit Expense
  const handleEditExpenseSave = () => {
    setEditExpenseModalVisible(false);
    setSelectedExpenseId({});
    fetchExpenses();
  };

  // Handle Delete Expense Button
  const handleDeleteExpense = (record) => {
    setSelectedExpenseId(record._id);
    setDeleteExpenseModalVisible(true);
  };

  // Close Delete Expense Modal
  const handleCancelDeleteExpense = () => {
    setDeleteExpenseModalVisible(false);
    setSelectedExpenseId({});
  };

  // On Delete Expense
  const handleDeleteExpenseSave = () => {
    setDeleteExpenseModalVisible(false);
    setSelectedExpenseId({});
    fetchExpenses();
  };

  // Search Expenses
  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  // Handle Date Range Change
  const handleDateChange = (dates) => {
    setDateRange(dates);
  };

  // Filter the expenses based on search text and date range
  const filteredExpenses = expenses
    .filter((expense) =>
      expense.expenseCategory.toLowerCase().includes(searchText)
    )
    .filter((expense) => {
      if (!dateRange || !dateRange.length) return true;
      const expenseDate = new Date(expense.expenseDate);
      return (
        expenseDate >= dateRange[0].startOf("day").toDate() &&
        expenseDate <= dateRange[1].endOf("day").toDate()
      );
    });

  const columns = [
    {
      title: "Expense Date",
      dataIndex: "expenseDate",
      key: "expenseDate",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Expense Category",
      dataIndex: "expenseCategory",
      key: "expenseCategory",
      responsive: ["md"],
    },
    {
      title: "Expense For",
      dataIndex: "expenseFor",
      key: "expenseFor",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      responsive: ["md"],
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space size="middle">
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
      ),
      responsive: ["lg"],
    },
  ];

  const expandedRowRender = (record) => (
    <div>
      <p>
        <b>Expense Date:</b> {record.expenseDate}
      </p>
      <p>
        <b>Expense Category:</b> {record.expenseCategory}
      </p>
      <p>
        <b>Expense For:</b> {record.expenseFor}
      </p>
      <p>
        <b>Amount:</b> {record.amount}
      </p>
      <p>
        <b>Note:</b> {record.note}
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
            Expenses List ({filteredExpenses.length})
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <Button type="primary" onClick={handleNewExpense}>
              New Expense
            </Button>
            <div style={{ display: "flex", gap: "10px" }}>
              <RangePicker
                onChange={handleDateChange}
                style={{ marginRight: "10px" }}
              />
              <Search
                placeholder="Search by category"
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
                dataSource={filteredExpenses}
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
          <NewExpenseModal
            visible={newExpenseModalVisible}
            onCancel={handleCancelNewExpense}
            onAdd={handleAddNewExpense}
          />
          <EditExpenseModal
            visible={editExpenseModalVisible}
            onCancel={handleCancelEditExpense}
            onEdit={handleEditExpenseSave}
            selectedExpenseId={selectedExpenseId}
          />
          <DeleteExpenseModal
            visible={deleteExpenseModalVisible}
            onCancel={handleCancelDeleteExpense}
            onDelete={handleDeleteExpenseSave}
            selectedExpenseId={selectedExpenseId}
          />
        </div>
      )}
    </>
  );
};

export default Expenses;
