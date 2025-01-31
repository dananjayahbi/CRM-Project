import React, { useState } from "react";
import { Modal, Button, message } from "antd";
import axios from "axios";

const DeleteCustomerModal = ({
  visible,
  onCancel,
  onDelete,
  selectedCustomerId,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:3000/api/customers/deleteCustomer/${selectedCustomerId}`
      );
      onDelete();
      onCancel();
      message.success("Customer deleted successfully.");
    } catch (error) {
      console.error(error);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Delete Customer"
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
      <p>Are you sure you want to delete this customer?</p>
    </Modal>
  );
};

export default DeleteCustomerModal;
