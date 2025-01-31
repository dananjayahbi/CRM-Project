import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Form, Input, Button, message } from "antd";

const EditUnitModal = ({ visible, onCancel, onEdit, selectedUnitId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchUnit = async () => {
    if (!selectedUnitId) return;
    try {
      const unit = await axios.get(
        `http://localhost:3000/api/units/getUnitById/${selectedUnitId}`
      );
      const { name, description } = unit.data;

      form.setFieldsValue({
        name,
        description,
      });
    } catch (error) {
      console.error("Error fetching unit:", error);
    }
  };

  useEffect(() => {
    if (visible && selectedUnitId) {
      fetchUnit();
    }
  }, [selectedUnitId, visible]);

  const handleEdit = async (values) => {
    if (!selectedUnitId) return;
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:3000/api/units/updateUnit/${selectedUnitId}`,
        values
      );
      onEdit();
      form.resetFields();
      onCancel();
      message.success("Unit updated successfully.");
    } catch (error) {
      console.error("Error updating unit:", error);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Unit"
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
          Edit Unit
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

export default EditUnitModal;
