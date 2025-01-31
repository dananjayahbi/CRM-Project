import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Form, Input, Button, message } from "antd";

const EditSupplierModal = ({
  visible,
  onCancel,
  onEdit,
  selectedSupplierId,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchSupplier = async () => {
    if (!selectedSupplierId) return;
    try {
      const supplier = await axios.get(
        `http://localhost:3000/api/suppliers/getSupplierById/${selectedSupplierId}`
      );
      const { name, email, mobile, address, nic } = supplier.data;

      form.setFieldsValue({
        name,
        email,
        mobile,
        address,
        nic,
      });
    } catch (error) {
      console.error("Error fetching supplier:", error);
    }
  };

  useEffect(() => {
    if (visible && selectedSupplierId) {
      fetchSupplier();
    }
  }, [selectedSupplierId, visible]);

  const handleEdit = async (values) => {
    if (!selectedSupplierId) return;
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:3000/api/suppliers/updateSupplier/${selectedSupplierId}`,
        values
      );
      onEdit();
      form.resetFields();
      onCancel();
      message.success("Supplier updated successfully.");
    } catch (error) {
      console.error("Error updating supplier:", error);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Supplier"
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
          Edit Supplier
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
          rules={[{ required: false}]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditSupplierModal;
