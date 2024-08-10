import React, { useState } from "react";
import { Modal, Button, message } from "antd";
import axios from "axios";

const DeleteBrandModal = ({
  visible,
  onCancel,
  onDelete,
  selectedBrandId,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:3000/api/brands/deleteBrand/${selectedBrandId}`
      );
      onDelete();
      onCancel();
      message.success("Brand deleted successfully.");
    } catch (error) {
      console.error(error);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Delete Brand"
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
      <p>Are you sure you want to delete this brand?</p>
    </Modal>
  );
};

export default DeleteBrandModal;
