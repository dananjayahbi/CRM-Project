import React, { useState } from "react";
import { Modal, Button, message } from "antd";
import axios from "axios";

const DeleteProductModal = ({ 
  visible,
  onCancel,
  onDelete,
  selectedProductId,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:3000/api/products/deleteProduct/${selectedProductId}`
      );
      onDelete();
      onCancel();
      message.success("Product deleted successfully.");
    } catch (error) {
      message.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Delete Product"
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
      <p>Are you sure you want to delete this product?</p>
    </Modal>
  );
};

export default DeleteProductModal;
