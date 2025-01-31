import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Form, Input, Button, message } from "antd";

const EditCustomerModal = ({ visible, onCancel, onEdit, selectedCustomerId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchCustomer = async () => {
    if (!selectedCustomerId) return;
    try {
      const customer = await axios.get(
        `http://localhost:3000/api/customers/getCustomerById/${selectedCustomerId}`
      );
      const { name, email, mobile, address, nic } = customer.data;

      form.setFieldsValue({
        name,
        email,
        mobile,
        address,
        nic,
      });
    } catch (error) {
      console.error("Error fetching customer:", error);
    }
  };

  useEffect(() => {
    if (visible && selectedCustomerId) {
      fetchCustomer();
    }
  }, [selectedCustomerId, visible]);

  const handleEdit = async (values) => {
    if (!selectedCustomerId) return;
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:3000/api/customers/updateCustomer/${selectedCustomerId}`,
        values
      );
      onEdit();
      form.resetFields();
      onCancel();
      message.success("Customer updated successfully.");
    } catch (error) {
      console.error("Error updating customer:", error);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Customer"
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
          Update Customer
        </Button>,
      ]}
    >
      <Form form={form} onFinish={handleEdit}>
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

export default EditCustomerModal;
