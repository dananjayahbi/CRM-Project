import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Form, Input, Button, message } from "antd";

const EditBrandModal = ({ visible, onCancel, onEdit, selectedBrandId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchBrand = async () => {
    if (!selectedBrandId) return;
    try {
      const brand = await axios.get(
        `http://localhost:3000/api/brands/getBrandById/${selectedBrandId}`
      );
      const { name, description } = brand.data;

      form.setFieldsValue({
        name,
        description,
      });
    } catch (error) {
      console.error("Error fetching brand:", error);
    }
  };

  useEffect(() => {
    if (visible && selectedBrandId) {
      fetchBrand();
    }
  }, [selectedBrandId, visible]);

  const handleEdit = async (values) => {
    if (!selectedBrandId) return;
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:3000/api/brands/updateBrand/${selectedBrandId}`,
        values
      );
      onEdit();
      form.resetFields();
      onCancel();
      message.success("Brand updated successfully.");
    } catch (error) {
      console.error("Error updating brand:", error);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Brand"
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
          Update Brand
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
        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditBrandModal;
