import React, { useState } from "react";
import axios from "axios";
import { Modal, Form, Input, Button, message } from "antd";

const NewTaxModal = ({ visible, onCancel, onAdd }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleAdd = async (values) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/taxes/createTax", values);
      onAdd();
      form.resetFields();
      onCancel();
      message.success("Tax added successfully.");
    } catch (error) {
      console.error(error);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Tax"
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
          Add Tax
        </Button>,
      ]}
    >
      <Form form={form} onFinish={handleAdd}>
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

export default NewTaxModal;
