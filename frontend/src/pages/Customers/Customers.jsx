import React, { useState, useEffect } from "react";
import {
  Space,
  Table,
  Tag,
  Button,
  ConfigProvider,
  Input,
  Select,
  Spin,
  Avatar,
  Badge,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import NewCustomerModal from "./NewCustomerModal";
import EditCustomerModal from "./EditCustomerModal";
import DeleteCustomerModal from "./DeleteCustomerModal";

const { Search } = Input;
const { Option } = Select;

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [newCustomerModalVisible, setNewCustomerModalVisible] = useState(false);
  const [editCustomerModalVisible, setEditCustomerModalVisible] =
    useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState({});
  const [deleteCustomerModalVisible, setDeleteCustomerModalVisible] =
    useState(false);

  const theme = {
    components: {
      Table: {
        headerBg: "#ededed",
      },
    },
  };

  // Fetch all customers from the server
  const fetchCustomers = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/customers/getAllCustomers"
      );
      setCustomers(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Hnadle New Customer Button
  const handleNewCustomer = () => {
    setNewCustomerModalVisible(true);
  };

  // Close New Customer Modal
  const closeNewCustomerModal = () => {
    setNewCustomerModalVisible(false);
  };

  // On Add New Customer
  const handleNewCustomerAdd = () => {
    setNewCustomerModalVisible(false);
    fetchCustomers();
  };

  // Handle Edit Customer Button
  const handleEditCustomer = (record) => {
    setSelectedCustomerId(record._id);
    setEditCustomerModalVisible(true);
  };

  // Close Edit Customer Modal
  const closeEditCustomerModal = () => {
    setEditCustomerModalVisible(false);
    setSelectedCustomerId({});
  };

  // On Edit Customer
  const handleEditCustomerSave = () => {
    setEditCustomerModalVisible(false);
    setSelectedCustomerId({});
    fetchCustomers();
  };

  // Handle Delete Customer Button
  const handleDeleteCustomer = (record) => {
    setSelectedCustomerId(record._id);
    setDeleteCustomerModalVisible(true);
  };

  // Close Delete Customer Modal
  const closeDeleteCustomerModal = () => {
    setDeleteCustomerModalVisible(false);
  };

  // On Delete Customer
  const handleDeleteCustomerSave = () => {
    setDeleteCustomerModalVisible(false);
    fetchCustomers();
  };

  // Search Functionality
  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  // Filter the customers based on the search text
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchText) ||
      customer.email.toLowerCase().includes(searchText) ||
      customer.mobile.toLowerCase().includes(searchText) ||
      customer.address.toLowerCase().includes(searchText) ||
      customer.nic.toLowerCase().includes(searchText)
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
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "NIC",
      dataIndex: "nic",
      key: "nic",
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEditCustomer(record)}>
            Edit
          </Button>
          <Button
            danger
            onClick={() => handleDeleteCustomer(record)}
            style={{ marginLeft: "-10px" }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];
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
            Customers List
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <Button type="primary" onClick={handleNewCustomer}>
              New Customer
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
          <div>
            <p style={{ margin: "-50px 0", textAlign: "left" }}>
              Total Customers: {filteredCustomers.length}
            </p>
          </div>
          <ConfigProvider theme={theme}>
            <Table
              columns={columns}
              dataSource={filteredCustomers}
              loading={loading}
              rowKey="_id"
            />
          </ConfigProvider>
          <NewCustomerModal
            visible={newCustomerModalVisible}
            onCancel={closeNewCustomerModal}
            onAdd={handleNewCustomerAdd}
          />
          <EditCustomerModal
            visible={editCustomerModalVisible}
            onCancel={closeEditCustomerModal}
            onEdit={handleEditCustomerSave}
            selectedCustomerId={selectedCustomerId}
          />
          <DeleteCustomerModal
            visible={deleteCustomerModalVisible}
            onCancel={closeDeleteCustomerModal}
            onDelete={handleDeleteCustomerSave}
            selectedCustomerId={selectedCustomerId}
          />
        </div>
      )}
    </>
  );
};

export default Customers;
