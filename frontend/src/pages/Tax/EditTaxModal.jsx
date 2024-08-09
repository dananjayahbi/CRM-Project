import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Form, Input, Button, message } from "antd";

const EditTaxModal = ({ visible, onCancel, onEdit, selectedTaxId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchTax = async () => {
    if (!selectedTaxId) return;
    try {
      const tax = await axios.get(
        `http://localhost:3000/api/taxes/getTaxById/${selectedTaxId}`
      );
      const { taxName, taxRate } = tax.data;

      form.setFieldsValue({
        taxName,
        taxRate,
      });
    } catch (error) {
      console.error("Error fetching tax:", error);
    }
  };

  useEffect(() => {
    if (visible && selectedTaxId) {
      fetchTax();
    }
  }, [selectedTaxId, visible]);

  const handleEdit = async (values) => {
    if (!selectedTaxId) return;
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:3000/api/taxes/updateTax/${selectedTaxId}`,
        values
      );
      onEdit();
      form.resetFields();
      onCancel();
      message.success("Tax updated successfully.");
    } catch (error) {
      console.error("Error updating tax:", error);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Tax"
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
          Update Tax
        </Button>,
      ]}
    >
      <Form form={form} onFinish={handleEdit}>
        <Form.Item
          name="taxName"
          label="Name"
          rules={[{ required: true, message: "Please input the name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="taxRate"
          label="Rate (%)"
          rules={[{ required: true, message: "Please input the rate!" }]}
        >
          <Input type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTaxModal;
