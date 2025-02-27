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
import NewUserModal from "./NewUserModal";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";

const { Search } = Input;
const { Option } = Select;

const Users = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterRoles, setFilterRoles] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
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

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    setSelectedUserId({});
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

  // Filter by Role Functionality
  const handleFilterRole = (value) => {
    setFilterRoles(value);
  };

  // Filter by Status Functionality
  const handleFilterStatus = (value) => {
    setFilterStatus(value);
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
    const matchesFilterStatus =
      filterStatus.length > 0
        ? filterStatus.includes(user.isActive.toString())
        : true;
    return matchesSearchText && matchesFilterRole && matchesFilterStatus;
  });

  const columns = [
    {
      title: "",
      dataIndex: "profilePicture",
      key: "profilePicture",
      width: 70,
      render: (text, record) => (
        <Badge
          count={record.isActive ? "Active" : "Inactive"}
          style={{ backgroundColor: record.isActive ? "#52c41a" : "#f5222d" }}
        >
          <Avatar
            src={"http://localhost:3000" + text}
            style={{ width: 50, height: 50, borderRadius: "50%" }}
          />
        </Badge>
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
      responsive: ["md"],
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
      responsive: ["md"],
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      width: 150,
      responsive: ["md"],
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
      responsive: ["md"],
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
      responsive: ["lg"],
    },
  ];

  const expandedRowRender = (record) => (
    <div>
      <p>
        <b>Username:</b> {record.username}
      </p>
      <p>
        <b>Email:</b> {record.email}
      </p>
      <p>
        <b>Mobile:</b> {record.mobile}
      </p>
      <p>
        <b>Role: </b>
        <Tag
          color={
            record.role === "superAdmin"
              ? "gold"
              : record.role === "admin"
              ? "green"
              : "blue"
          }
          key={record.role}
        >
          {record.role.toUpperCase()}
        </Tag>
      </p>
      <Space size="middle" style={{ marginTop: "10px" }}>
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
        <div style={{ margin: "-40px 0 0 0" }}>
          <p style={{ textAlign: "left", fontSize: "30px", fontWeight: 500 }}>
            Users List ({filteredAndSearchedUsers.length})
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
              <Select
                mode="multiple"
                placeholder="Filter by status"
                onChange={handleFilterStatus}
                allowClear
                style={{ width: 200 }}
              >
                <Option value="true">Active</Option>
                <Option value="false">Inactive</Option>
              </Select>
            </div>
          </div>
          <ConfigProvider theme={theme}>
            <div style={{ maxWidth: "100%", overflowX: "auto" }}>
              <Table
                columns={columns}
                dataSource={filteredAndSearchedUsers}
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
