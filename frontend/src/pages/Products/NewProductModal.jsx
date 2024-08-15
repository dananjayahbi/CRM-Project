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
  const [taxType, setTaxType] = useState("inclusive");
  const [profitMargin, setProfitMargin] = useState(0);
  const [salesPrice, setSalesPrice] = useState(0);
  const [discountType, setDiscountType] = useState("percentage");
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  // Handle Modal cancel and reset form fields
  const handleCancel = () => {
    form.resetFields();
    setPurchasePrice(0);
    setProductPrice(0);
    setSalesPrice(0);
    setProfitMargin(0);
    setSelectedTax(0);
    setTaxType("inclusive");
    setDiscountType("percentage");
    setDiscount(0);
    setFinalPrice(0);
    onCancel();
  };

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

  // Handle Add Product
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

  // Handle Product Price Change
  const handleProductPriceChange = (value) => {
    setProductPrice(value);
  };

  // Handle Tax Type Change
  const handleTaxTypeChange = (value) => {
    setTaxType(value);
  };

  // Handle Sales Price Change
  const handleSalesPriceChange = (value) => {
    setSalesPrice(value);
  };

  // Handle Discount Type Change
  const handleDiscountTypeChange = (value) => {
    setDiscountType(value);
  };

  // Handle discount change
  const handleDiscountChange = (value) => {
    setDiscount(value);
  };

  // Calculate Purchase Price
  useEffect(() => {
    if (taxType === "inclusive") {
      setPurchasePrice(productPrice);
      form.setFieldsValue({ purchasePrice: productPrice });
    } else if (taxType === "exclusive") {
      let calculatedPurchasePrice =
        productPrice + (productPrice * selectedTax) / 100;
      setPurchasePrice(calculatedPurchasePrice);
      form.setFieldsValue({ purchasePrice: calculatedPurchasePrice });
    }
  }, [productPrice, selectedTax, taxType]);

  // Calculate Sales Price based on Profit Margin
  useEffect(() => {
    if (profitMargin === 0) {
      setSalesPrice(purchasePrice);
      form.setFieldsValue({ salesPrice: purchasePrice });
    } else {
      let calculatedSalesPrice = parseFloat(
        (purchasePrice + purchasePrice * (profitMargin / 100)).toFixed(2)
      );
      setSalesPrice(calculatedSalesPrice);
      form.setFieldsValue({ salesPrice: calculatedSalesPrice });
    }
  }, [purchasePrice]);

  // Calculate Profit Margin based on Sales Price
  useEffect(() => {
    let calculatedProfitMargin = parseFloat(
      ((salesPrice - purchasePrice) / purchasePrice) * 100
    ).toFixed(2);
    setProfitMargin(calculatedProfitMargin);
    form.setFieldsValue({ profitMargin: calculatedProfitMargin });
  }, [salesPrice]);

  //calculate sales price based on profit margin
  const calculatePrifitMargin = (value) => {
    if (profitMargin === 0) {
      setSalesPrice(purchasePrice);
      form.setFieldsValue({ salesPrice: purchasePrice });
    } else {
      let calculatedSalesPrice = parseFloat(
        (purchasePrice + purchasePrice * (value / 100)).toFixed(2)
      );
      setSalesPrice(calculatedSalesPrice);
      form.setFieldsValue({ salesPrice: calculatedSalesPrice });
    }
  };

  // Calculate Final Price based on Discount
  useEffect(() => {
    if (discountType === "percentage") {
      let calculatedFinalPrice = parseFloat(
        salesPrice - (salesPrice * discount) / 100
      ).toFixed(2);
      form.setFieldsValue({ finalPrice: calculatedFinalPrice });
    } else if (discountType === "fixed") {
      let calculatedFinalPrice = parseFloat(salesPrice - discount).toFixed(2);
      form.setFieldsValue({ finalPrice: calculatedFinalPrice });
    }
  }, [salesPrice, discountType, discount]);

  return (
    <Modal
      title="Add New Product"
      width="1200px"
      centered
      visible={visible}
      onCancel={handleCancel}
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
              name="category"
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
              label="Price (Rs.)"
              rules={[
                {
                  required: true,
                  message: "Please input the price.",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Product Price"
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
              <Select
                placeholder="Select Tax"
                onChange={handleTaxChange}
                // Disable if the product price is 0 or null
                disabled={productPrice === 0}
              >
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
              label="Purchase Price (Rs.)"
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
                disabled={true}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="taxType"
              label="Tax Type"
              rules={[
                {
                  required: false,
                  message: "Please select the tax type.",
                },
              ]}
            >
              <Select
                placeholder="Select Tax Type"
                onChange={handleTaxTypeChange}
                defaultValue="inclusive"
                // Disable if the tax is 0 or null
                disabled={selectedTax === 0}
              >
                <Select.Option key="inclusive" value="inclusive">
                  Inclusive
                </Select.Option>
                <Select.Option key="exclusive" value="exclusive">
                  Exclusive
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="salesPrice"
              label="Sales Price (Rs.)"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                value={salesPrice}
                placeholder={salesPrice}
                defaultValue={salesPrice}
                // Disable if the purchase price and price are 0 or null
                disabled={purchasePrice === 0 && productPrice === 0}
                onChange={handleSalesPriceChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="profitMargin"
              label="Profit Margin (%)"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                value={profitMargin}
                placeholder="Profit in %"
                disabled={purchasePrice === 0}
                defaultValue={0}
                onChange={calculatePrifitMargin}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="discountType"
              label="Discount Type"
              rules={[
                {
                  required: false,
                  message: "Please select the discount type.",
                },
              ]}
            >
              <Select
                placeholder="Select Discount Type"
                onChange={handleDiscountTypeChange}
              >
                <Select.Option key="percentage" value="percentage">
                  Percentage
                </Select.Option>
                <Select.Option key="fixed" value="fixed">
                  Fixed
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="discount"
              label="Discount"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Discount"
                disabled={salesPrice === 0}
                onChange={handleDiscountChange}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="finalPrice"
              label="Final Price (Rs.)"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Final Price"
                value={finalPrice}
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={12}>{/* Space */}</Col>
        </Row>

        <Divider />

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="currentOpeningStock"
              label="Current Opening Stock"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Opening Stock"
              />
            </Form.Item>
          </Col>
          <Col span={12}>{/* Space */}</Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default NewProductModal;
