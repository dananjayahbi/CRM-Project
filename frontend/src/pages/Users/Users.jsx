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
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import NewUserModal from "./NewUserModal";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";

const { Search } = Input;
const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterRoles, setFilterRoles] = useState([]);
  const [newUserModalVisible, setNewUserModalVisible] = useState(false);
  const [editUserModalVisible, setEditUserModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState({});
  const [deleteUserModalVisible, setDeleteUserModalVisible] = useState(false);

  const theme = {
    components: {
      Table: {
        headerBg: "#ededed",
      },
    },
  };

  // Fetch all users from the server
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/users/getAllUsers"
      );
      // Map the data to combine firstName and lastName into a single name field
      const formattedData = data.map((user) => ({
        ...user,
        name: `${user.firstName} ${user.lastName}`,
        profilePicture:
          user.profilePicture ||
          "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
      }));
      setUsers(formattedData);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle New User Button
  const handleNewUser = () => {
    setNewUserModalVisible(true);
  };

  // Close New User Modal
  const handleCancelNewUser = () => {
    setNewUserModalVisible(false);
  };

  // On Add New User
  const handleNewUserAdd = () => {
    setNewUserModalVisible(false);
    fetchUsers();
  };

  // Handle Edit User Button
  const handleEditUser = (record) => {
    setSelectedUserId(record._id);
    setEditUserModalVisible(true);
  };

  // Close Edit User Modal
  const handleCancelEditUser = () => {
    setEditUserModalVisible(false);
    setSelectedUserId({});
  };

  // On Edit User
  const handleEditUserSave = () => {
    setEditUserModalVisible(false);
    fetchUsers();
  };

  // Handle Delete User Button
  const handleDeleteUser = (record) => {
    setSelectedUserId(record._id);
    setDeleteUserModalVisible(true);
  };

  // Close Delete User Modal
  const handleCancelDeleteUser = () => {
    setDeleteUserModalVisible(false);
  };

  // On Delete User
  const handleDeleteUserSave = () => {
    setDeleteUserModalVisible(false);
    fetchUsers();
  };

  // Search Functionality
  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  // Filter Functionality
  const handleFilterRole = (value) => {
    setFilterRoles(value);
  };

  // Filter and search users
  const filteredAndSearchedUsers = users.filter((user) => {
    const matchesSearchText =
      user.name.toLowerCase().includes(searchText) ||
      user.username.toLowerCase().includes(searchText) ||
      user.mobile.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText);
    const matchesFilterRole =
      filterRoles.length > 0 ? filterRoles.includes(user.role) : true;
    return matchesSearchText && matchesFilterRole;
  });

  const columns = [
    {
      title: "",
      dataIndex: "profilePicture",
      key: "profilePicture",
      width: 70,
      render: (text) => (
        <img
          src={text}
          alt="Profile"
          style={{ width: 50, height: 50, borderRadius: "50%" }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      width: 150,
    },
    {
      title: "Role",
      key: "role",
      dataIndex: "role",
      width: 100,
      render: (role) => (
        <Tag
          color={
            role === "superAdmin" ? "gold" : role === "admin" ? "green" : "blue"
          }
          key={role}
        >
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEditUser(record)}>
            Edit
          </Button>
          <Button
            danger
            onClick={() => handleDeleteUser(record)}
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
        <div style={{ margin: "-40px 0 0 0" }}>
          <p style={{ textAlign: "left", fontSize: "30px", fontWeight: 500 }}>
            Users List
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <Button type="primary" onClick={handleNewUser}>
              New User
            </Button>
            <div style={{ display: "flex", gap: "10px" }}>
              <Search
                placeholder="Search users"
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 200 }}
              />
              <Select
                mode="multiple"
                placeholder="Filter by role"
                onChange={handleFilterRole}
                allowClear
                style={{ width: 200 }}
              >
                <Option value="admin">Admin</Option>
                <Option value="superAdmin">Super Admin</Option>
                <Option value="staff">Staff</Option>
              </Select>
            </div>
          </div>
          <ConfigProvider theme={theme}>
            <Table
              columns={columns}
              dataSource={filteredAndSearchedUsers}
              loading={loading}
              rowKey="_id"
            />
          </ConfigProvider>
          <NewUserModal
            visible={newUserModalVisible}
            onCancel={handleCancelNewUser}
            onAdd={handleNewUserAdd}
          />
          <EditUserModal
            visible={editUserModalVisible}
            onCancel={handleCancelEditUser}
            onEdit={handleEditUserSave}
            selectedUserId={selectedUserId}
          />
          <DeleteUserModal
            visible={deleteUserModalVisible}
            onCancel={handleCancelDeleteUser}
            onDelete={handleDeleteUserSave}
            selectedUserId={selectedUserId}
          />
        </div>
      )}
    </>
  );
};

export default Users;
