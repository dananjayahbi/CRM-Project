import React, { useState } from "react";
import { Modal, Button, message } from "antd";
import axios from "axios";

const DeleteUnitModal = ({ visible, onCancel, onDelete, selectedUnitId }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:3000/api/units/deleteUnit/${selectedUnitId}`
      );
      onDelete();
      onCancel();
      message.success("Unit deleted successfully.");
    } catch (error) {
      message.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Delete Unit"
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
      <p>Are you sure you want to delete this unit?</p>
    </Modal>
  );
};

export default DeleteUnitModal;
