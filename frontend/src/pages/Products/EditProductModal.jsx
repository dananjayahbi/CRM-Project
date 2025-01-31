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
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const EditProductModal = ({ visible, onCancel, onEdit, selectedProductId }) => {
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
  const [fileList, setFileList] = useState([]);

  // Handle modal cancel
  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
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

  // Fetch Product Details from the server
  const fetchProduct = async () => {
    try {
      const product = await axios.get(
        `http://localhost:3000/api/products/getProductById/${selectedProductId}`
      );

      const {
        name,
        category,
        brand,
        unit,
        minimumQty,
        barcode,
        description,
        imageUrl: image,
        price,
        tax,
        purchasePrice,
        taxType,
        salesPrice,
        profitMargin,
        discountType,
        discount,
        finalPrice,
        currentOpeningStock,
      } = product.data;

      form.setFieldsValue({
        name,
        category,
        brand,
        unit,
        minimumQty,
        barcode,
        description,
        price,
        tax,
        purchasePrice,
        taxType,
        salesPrice,
        profitMargin,
        discountType,
        discount,
        finalPrice,
        currentOpeningStock,
      });

      // If there's an existing product image, set it to the fileList
      if (image) {
        setFileList([
          {
            uid: "-1", // An arbitrary unique ID for the uploaded file
            name: image.split("/").pop(), // Get the filename
            status: "done", // Mark it as done
            url: "http://localhost:3000" + image, // URL of the existing product image
          },
        ]);
      } else {
        setFileList([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedProductId && visible) {
      fetchProduct();
    }
  }, [selectedProductId, visible]);

  // Handle Edit Product
  const handleEdit = async (values) => {
    if (!selectedProductId) return;
    setLoading(true);
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("productImage", fileList[0].originFileObj);
    }

    try {
      await axios.put(
        `http://localhost:3000/api/products/updateProduct/${selectedProductId}`,
        values
      );
      onEdit();
      form.resetFields();
      setFileList([]);
      onCancel();
      message.success("Product updated successfully.");
    } catch (error) {
      console.error("Error updating product:", error);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = ({ fileList }) => setFileList(fileList);

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
      title="Edit Product"
      width="1200px"
      centered
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
          Update
        </Button>,
      ]}
    >
      <Form form={form} layout="horizontal" onFinish={handleEdit}>
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
          <Col span={12}>
            <Form.Item
              name="image"
              label="Product Image"
              rules={[
                {
                  required: false,
                  message: "Please select the product image.",
                },
              ]}
            >
              <Upload
                listType="picture"
                fileList={fileList}
                beforeUpload={() => false}
                onChange={handleFileChange}
              >
                <Button icon={<UploadOutlined />}>Upload Product Image</Button>
              </Upload>
            </Form.Item>
          </Col>
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

export default EditProductModal;
