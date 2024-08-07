import React, { useState } from "react";
import { Modal, Button } from "antd";
import axios from "axios";

const DeleteUserModal = ({ visible, onCancel, onDelete, selectedUserId }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:3000/api/users/deleteUser/${selectedUserId}`
      );
      onDelete();
      onCancel();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Delete User"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button danger key="delete" loading={loading} onClick={handleDelete}>
          Delete
        </Button>,
      ]}
    >
      <p>Are you sure you want to delete this user?</p>
    </Modal>
  );
};

export default DeleteUserModal;
