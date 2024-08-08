import React, { useState } from "react";
import axios from "axios";
import { Modal, Form, Input, Button, message } from "antd";

const NewCustomerModal = ({ visible, onCancel, onAdd }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleAdd = async (values) => {
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:3000/api/customers/createCustomer",
        values
      );
      onAdd();
      form.resetFields();
      onCancel();
      message.success("Customer added successfully.");
    } catch (error) {
      console.error(error);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Customer"
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
          Add Customer
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
          name="email"
          label="Email"
          rules={[{ required: true, message: "Please input the email!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="mobile"
          label="Mobile"
          rules={[{ required: true, message: "Please input the mobile!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: false, message: "Please input the address!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="nic"
          label="NIC"
          rules={[{ required: false, message: "Please input the NIC!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewCustomerModal;
