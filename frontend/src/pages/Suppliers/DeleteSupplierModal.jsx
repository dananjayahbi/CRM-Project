import React, { useState } from "react";
import { Modal, Button, message } from "antd";
import axios from "axios";

const DeleteSupplierModal = ({
  visible,
  onCancel,
  onDelete,
  selectedSupplierId,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:3000/api/suppliers/deleteSupplier/${selectedSupplierId}`
      );
      onDelete();
      onCancel();
      message.success("Supplier deleted successfully.");
    } catch (error) {
      console.error(error);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      title="Delete Supplier"
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
      <p>Are you sure you want to delete this supplier?</p>
    </Modal>
  );
};

export default DeleteSupplierModal;
