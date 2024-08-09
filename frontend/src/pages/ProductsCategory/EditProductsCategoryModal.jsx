import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Form, Input, Button, message } from "antd";

const EditProductsCategoryModal = ({
  visible,
  onCancel,
  onEdit,
  selectedProductCategoryId,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchProductsCategory = async () => {
    if (!selectedProductCategoryId) return;
    try {
      const productsCategory = await axios.get(
        `http://localhost:3000/api/productsCategories/getProductCategoryById/${selectedProductCategoryId}`
      );
      const { name, description } = productsCategory.data;

      form.setFieldsValue({
        name,
        description,
      });
    } catch (error) {
      console.error("Error fetching products category:", error);
    }
  };

  useEffect(() => {
    if (visible && selectedProductCategoryId) {
      fetchProductsCategory();
    }
  }, [selectedProductCategoryId, visible]);

  const handleEdit = async (values) => {
    if (!selectedProductCategoryId) return;
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:3000/api/productsCategories/updateProductCategory/${selectedProductCategoryId}`,
        values
      );
      onEdit();
      form.resetFields();
      onCancel();
      message.success("Products Category updated successfully.");
    } catch (error) {
      console.error("Error updating products category:", error);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Products Category"
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
          Edit Products Category
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

export default EditProductsCategoryModal;
