import React, { useEffect, useState } from "react";
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
import moment from "moment";

const EditExpenseModal = ({ visible, onCancel, onEdit, selectedExpenseId }) => {
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

  const fetchExpense = async () => {
    if (!selectedExpenseId) return;
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/expenses/getExpenseById/${selectedExpenseId}`
      );
      const { expenseDate, expenseCategory, expenseFor, amount, note } = data;

      form.setFieldsValue({
        expenseDate: moment(expenseDate), // Ensure expenseDate is a moment object
        expenseCategory,
        expenseFor,
        amount,
        note,
      });
    } catch (error) {
      console.error("Error fetching expense:", error);
    }
  };

  useEffect(() => {
    if (visible && selectedExpenseId) {
      fetchExpense();
    }
  }, [selectedExpenseId, visible]);

  const handleEdit = async (values) => {
    if (!selectedExpenseId) return;
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:3000/api/expenses/updateExpense/${selectedExpenseId}`,
        {
          ...values,
          expenseDate: values.expenseDate.toISOString(), // Convert date to ISO format for storage
        }
      );
      onEdit();
      form.resetFields();
      onCancel();
      message.success("Expense updated successfully.");
    } catch (error) {
      console.error("Error updating expense:", error);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Expense"
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
          Update Expense
        </Button>,
      ]}
    >
      <Form form={form} onFinish={handleEdit}>
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
              <Select.Option key={category.id} value={category.name}>
                {category.name}
              </Select.Option>
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

export default EditExpenseModal;
