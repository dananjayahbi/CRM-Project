import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  Form,
  Input,
  Button,
  message,
  DatePicker,
  Select,
  InputNumber,
} from "antd";

const NewExpenseModal = ({ visible, onCancel, onAdd }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [expenseCategories, setExpenseCategories] = useState([]);

  // Fetch all expense categories from the server
  const fetchExpenseCategories = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/expenseCategories/getAllExpenseCategories"
      );
      setExpenseCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchExpenseCategories();
    }
  }, [visible]);

  const handleAdd = async (values) => {
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:3000/api/expenses/createExpense",
        values
      );
      onAdd();
      form.resetFields();
      onCancel();
      message.success("Expense added successfully.");
    } catch (error) {
      console.error(error);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Expense"
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
          Add Expense
        </Button>,
      ]}
    >
      <Form form={form} onFinish={handleAdd}>
        <Form.Item
          name="expenseDate"
          label="Expense Date"
          rules={[{ required: true, message: "Please input the date!" }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="expenseCategory"
          label="Expense Category"
          rules={[{ required: true, message: "Please select a category!" }]}
          getValueFromEvent={(value) => value}
        >
          <Select placeholder="Select a category" allowClear>
            {expenseCategories.map((category) => (
              <Option key={category.id} value={category.name}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="expenseFor"
          label="Expense For"
          rules={[{ required: true, message: "Please input the Expense for!" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="amount"
          label="Amount"
          rules={[{ required: true, message: "Please input the amount!" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="note"
          label="Note"
          rules={[{ required: false, message: "Please input the note!" }]}
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewExpenseModal;
