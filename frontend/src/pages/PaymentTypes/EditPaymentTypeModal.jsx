import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Form, Input, Button, message } from "antd";

const EditPaymentTypeModal = ({
  visible,
  onCancel,
  onEdit,
  selectedPaymentTypeId,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchPaymentType = async () => {
    if (!selectedPaymentTypeId) return;
    try {
      const paymentType = await axios.get(
        `http://localhost:3000/api/paymentTypes/getPaymentTypeById/${selectedPaymentTypeId}`
      );
      const { name } = paymentType.data;

      form.setFieldsValue({
        name,
      });
    } catch (error) {
      console.error("Error fetching payment type:", error);
    }
  };

  useEffect(() => {
    if (visible && selectedPaymentTypeId) {
      fetchPaymentType();
    }
  }, [selectedPaymentTypeId, visible]);

  const handleEdit = async (values) => {
    if (!selectedPaymentTypeId) return;
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:3000/api/paymentTypes/updatePaymentType/${selectedPaymentTypeId}`,
        values
      );
      onEdit();
      form.resetFields();
      onCancel();
      message.success("Payment type updated successfully.");
    } catch (error) {
      console.error("Error updating payment type:", error);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Payment Type"
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
          Update Payment Type
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
      </Form>
    </Modal>
  );
};

export default EditPaymentTypeModal;
