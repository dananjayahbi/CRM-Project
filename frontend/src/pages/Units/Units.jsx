import React, { useState, useEffect } from "react";
import { Space, Table, Button, ConfigProvider, Input, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import NewUnitModal from "./NewUnitModal";
import EditUnitModal from "./EditUnitModal";
import DeleteUnitModal from "./DeleteUnitModal";

const { Search } = Input;

const Units = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [newUnitModalVisible, setNewUnitModalVisible] = useState(false);
  const [editUnitModalVisible, setEditUnitModalVisible] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState({});
  const [deleteUnitModalVisible, setDeleteUnitModalVisible] = useState(false);

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

  // Fetch all units from the server
  const fetchUnits = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/units/getAllUnits"
      );
      setUnits(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  // Hnadle New Unit Button
  const handleNewUnit = () => {
    setNewUnitModalVisible(true);
  };

  // Close New Unit Modal
  const closeNewUnitModal = () => {
    setNewUnitModalVisible(false);
  };

  // On Add New Unit
  const handleAddUnit = () => {
    setNewUnitModalVisible(false);
    fetchUnits();
  };

  // Handle Edit Unit Button
  const handleEditUnit = (record) => {
    setSelectedUnitId(record._id);
    setEditUnitModalVisible(true);
  };

  // Close Edit Unit Modal
  const closeEditUnitModal = () => {
    setEditUnitModalVisible(false);
    setSelectedUnitId({});
  };

  // On Edit Unit
  const handleEdit = () => {
    setEditUnitModalVisible(false);
    setSelectedUnitId({});
    fetchUnits();
  };

  // Handle Delete Unit Button
  const handleDeleteUnit = (record) => {
    setSelectedUnitId(record._id);
    setDeleteUnitModalVisible(true);
  };

  // Close Delete Unit Modal
  const closeDeleteUnitModal = () => {
    setDeleteUnitModalVisible(false);
  };

  // On Delete Unit
  const handleDelete = () => {
    setDeleteUnitModalVisible(false);
    fetchUnits();
  };

  // Search Functionality
  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  // Filter units based on search text
  const filteredUnits = units.filter((unit) =>
    unit.name.toLowerCase().includes(searchText)
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
          <Button type="primary" onClick={() => handleEditUnit(record)}>
            Edit
          </Button>
          <Button
            danger
            onClick={() => handleDeleteUnit(record)}
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
            Units List ({filteredUnits.length})
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <Button type="primary" onClick={handleNewUnit}>
              New Unit
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
                dataSource={filteredUnits}
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
          <NewUnitModal
            visible={newUnitModalVisible}
            onCancel={closeNewUnitModal}
            onAdd={handleAddUnit}
          />
          <EditUnitModal
            visible={editUnitModalVisible}
            onCancel={closeEditUnitModal}
            onEdit={handleEdit}
            selectedUnitId={selectedUnitId}
          />
          <DeleteUnitModal
            visible={deleteUnitModalVisible}
            onCancel={closeDeleteUnitModal}
            onDelete={handleDelete}
            selectedUnitId={selectedUnitId}
          />
        </div>
      )}
    </>
  );
};

export default Units;
