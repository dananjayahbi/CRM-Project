import React, { useState } from "react";
import axios from "axios";
import { Modal, Form, Input, Button, message } from "antd";

const NewExpenseCategoryModal = ({ visible, onCancel, onAdd }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleAdd = async (values) => {
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:3000/api/expenseCategories/createExpenseCategory",
        values
      );
      onAdd();
      form.resetFields();
      onCancel();
      message.success("Expense category added successfully.");
    } catch (error) {
      console.error(error);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Expense Category"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
        >
          Add Expense Category
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleAdd}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input the name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: false, message: "Please input the description!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewExpenseCategoryModal;
