import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  Form,
  Input,
  Button,
  message,
  Select,
  InputNumber,
  Row,
  Col,
  Divider,
} from "antd";

const NewProductModal = ({ visible, onCancel, onAdd }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [productCategories, setProductCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);
  const [tax, setTax] = useState([]);
  const [selectedTax, setSelectedTax] = useState(0);
  const [productPrice, setProductPrice] = useState(0);
  const [purchasePrice, setPurchasePrice] = useState(0);

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

  // Fetch all taxes from the server
  const fetchTaxes = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/taxes/getAllTaxes"
      );
      setTax(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchProductCategories();
      fetchBrands();
      fetchUnits();
      fetchTaxes();
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

  // Handle Tax Change
  const handleTaxChange = (value) => {
    setSelectedTax(value);
  };

  // Handle Product Price Change and calculate purchase price
  const handleProductPriceChange = (value) => {
    setProductPrice(value);
    if (selectedTax === 0) {
      return value;
    } else {
      return value + value * (selectedTax / 100);
    }
  };

  // Calculate Purchase Price
  useEffect(() => {
    if (selectedTax === 0) {
      setPurchasePrice(productPrice);
    } else {
      setPurchasePrice(productPrice + productPrice * (selectedTax / 100));
    }
  }, [productPrice, selectedTax]);

  // Log selectedTax whenever it changes
  // useEffect(() => {
  //   console.log(purchasePrice);
  // }, [purchasePrice]);

  return (
    <Modal
      title="Add New Product"
      width="1200px"
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
      <Form form={form} layout="horizontal" onFinish={handleAdd}>
        <Row gutter={24}>
          <Col span={12}>
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
          </Col>
          <Col span={12}>
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
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
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
          </Col>
          <Col span={12}>
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
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="minimumQty"
              label="Minimum Quantity"
              rules={[
                {
                  required: false,
                  message: "Please input the minimum quantity.",
                },
              ]}
            >
              <InputNumber
                placeholder="Minimum Qty"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="barcode"
              label="Barcode"
              rules={[
                {
                  required: false,
                  message: "Please input the barcode.",
                },
              ]}
            >
              <Input placeholder="Barcode" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  required: false,
                  message: "Please input the description.",
                },
              ]}
            >
              <Input.TextArea placeholder="Description" />
            </Form.Item>
          </Col>
          <Col span={12}>{/* The product Image space */}</Col>
        </Row>

        <Divider />

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="price"
              label="Price"
              rules={[
                {
                  required: true,
                  message: "Please input the price.",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                onChange={handleProductPriceChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="tax"
              label="Tax"
              rules={[
                {
                  required: true,
                  message: "Please select the tax.",
                },
              ]}
            >
              <Select placeholder="Select Tax" onChange={handleTaxChange}>
                <Select.Option key="none" value="0">
                  None(0.00%)
                </Select.Option>
                {tax.map((taxItem) => (
                  <Select.Option key={taxItem._id} value={taxItem.taxRate}>
                    {taxItem.taxName} ({taxItem.taxRate}%)
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="purchasePrice"
              label="Purchase Price"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                value={purchasePrice}
                placeholder={purchasePrice}
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="barcode"
              label="Barcode"
              rules={[
                {
                  required: false,
                  message: "Please input the barcode.",
                },
              ]}
            >
              <Input placeholder="Barcode" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default NewProductModal;
