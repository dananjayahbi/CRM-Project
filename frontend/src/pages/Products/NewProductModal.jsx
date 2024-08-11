import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Form, Input, Button, message, Select, InputNumber } from "antd";

const NewProductModal = ({ visible, onCancel, onAdd }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [productCategories, setProductCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);

  // Fetch all product categories from the server
  const fetchProductCategories = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/productsCategories/getAllProductCategories"
      );
      setProductCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch all brands from the server
  const fetchBrands = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/brands/getAllBrands"
      );
      setBrands(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch all units from the server
  const fetchUnits = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/units/getAllUnits"
      );
      setUnits(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchProductCategories();
      fetchBrands();
      fetchUnits();
    }
  }, [visible]);

  const handleAdd = async (values) => {
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:3000/api/products/createProduct",
        values
      );
      onAdd();
      form.resetFields();
      onCancel();
      message.success("Product added successfully.");
    } catch (error) {
      console.error(error);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Product"
      width="1000px"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="add"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
        >
          Add
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleAdd}>
        <Form.Item
          name="name"
          label="Product Name"
          rules={[
            {
              required: true,
              message: "Please input the product name.",
            },
          ]}
        >
          <Input placeholder="Product Name" />
        </Form.Item>
        <Form.Item
          name="productCategory"
          label="Product Category"
          rules={[
            {
              required: true,
              message: "Please select the product category.",
            },
          ]}
        >
          <Select placeholder="Select Product Category">
            {productCategories.map((category) => (
              <Select.Option key={category._id} value={category.name}>
                {category.categoryName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="brand"
          label="Brand"
          rules={[
            {
              required: true,
              message: "Please select the brand.",
            },
          ]}
        >
          <Select placeholder="Select Brand">
            {brands.map((brand) => (
              <Select.Option key={brand._id} value={brand.name}>
                {brand.brandName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="unit"
          label="Unit"
          rules={[
            {
              required: true,
              message: "Please select the unit.",
            },
          ]}
        >
          <Select placeholder="Select Unit">
            {units.map((unit) => (
              <Select.Option key={unit._id} value={unit.name}>
                {unit.unitName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="productPrice"
          label="Product Price"
          rules={[
            {
              required: true,
              message: "Please input the product price.",
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          />
        </Form.Item>
        <Form.Item
          name="productDescription"
          label="Product Description"
          rules={[
            {
              required: true,
              message: "Please input the product description.",
            },
          ]}
        >
          <Input.TextArea placeholder="Product Description" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewProductModal;
