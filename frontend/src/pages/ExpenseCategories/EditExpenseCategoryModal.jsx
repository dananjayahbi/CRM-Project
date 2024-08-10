import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Form, Input, Button, message } from "antd";

const EditExpenseCategoryModal = ({
  visible,
  onCancel,
  onEdit,
  selectedExpenseCategoryId,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchExpenseCategory = async () => {
    if (!selectedExpenseCategoryId) return;
    try {
      const expenseCategory = await axios.get(
        `http://localhost:3000/api/expenseCategories/getExpenseCategoryById/${selectedExpenseCategoryId}`
      );
      const { name, description } = expenseCategory.data;

      form.setFieldsValue({
        name,
        description,
      });
    } catch (error) {
      console.error("Error fetching expense category:", error);
    }
  };

  useEffect(() => {
    if (visible && selectedExpenseCategoryId) {
      fetchExpenseCategory();
    }
  }, [selectedExpenseCategoryId, visible]);

  const handleEdit = async (values) => {
    if (!selectedExpenseCategoryId) return;
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:3000/api/expenseCategories/updateExpenseCategory/${selectedExpenseCategoryId}`,
        values
      );
      onEdit();
      form.resetFields();
      onCancel();
      message.success("Expense category updated successfully.");
    } catch (error) {
      console.error("Error updating expense category:", error);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Expense Category"
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
          Edit Expense Category
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleEdit}>
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
          rules={[
            { required: false, message: "Please input the description!" },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditExpenseCategoryModal;
