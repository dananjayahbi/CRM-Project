import React, { useState } from "react";
import { Modal, Button, message } from "antd";
import axios from "axios";

const DeleteExpenseModal = ({
  visible,
  onCancel,
  onDelete,
  selectedExpenseId,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:3000/api/expenses/deleteExpense/${selectedExpenseId}`
      );
      onDelete();
      onCancel();
      message.success("Expense deleted successfully.");
    } catch (error) {
      console.error(error);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Delete Expense"
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
      <p>Are you sure you want to delete this expense?</p>
    </Modal>
  );
};

export default DeleteExpenseModal;
