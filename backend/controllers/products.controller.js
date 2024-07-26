const sequelize = require("../config/db.config");

const Product = require("../models/products.model");
sequelize.sync({ force: false });

// Geterate a new code for the product
const generateProductCode = async () => {
  const newProductCode = `PRD${Math.floor(1000 + Math.random() * 9000)}`;
  const product = await Product.findOne({
    where: { productCode: newProductCode },
  });
  if (product) {
    return generateProductCode();
  }
  return newProductCode;
};

// Create a new product
exports.createProduct = async (req, res) => {
  // generate a new product code
  const productCode = await generateProductCode();
  try {
    const {
      name,
      brand,
      category,
      unit,
      minimumQty,
      barcode,
      description,
      imageUrl,
      price,
      tax,
      purchasePrice,
      taxType,
      profitMargin,
      salesPrice,
      finalPrice,
      discountType,
      discount,
      currentOpeningStock,
    } = req.body;

    if (
      !name ||
      !brand ||
      !category ||
      !unit ||
      !barcode ||
      !price ||
      !tax ||
      !purchasePrice ||
      !taxType ||
      !salesPrice ||
      !finalPrice
    ) {
      return res.status(400).send("Some fields are missing!");
    }

    const createdProduct = await Product.create({
      productCode,
      name,
      brand,
      category,
      unit,
      minimumQty: minimumQty ? minimumQty : 0,
      barcode,
      description: description ? description : "",
      imageUrl: imageUrl ? imageUrl : "",
      price,
      tax,
      purchasePrice,
      taxType,
      profitMargin: profitMargin ? profitMargin : 0,
      salesPrice,
      finalPrice,
      discountType: discountType ? discountType : "",
      discount: discount ? discount : 0,
      currentOpeningStock: currentOpeningStock ? currentOpeningStock : 0,
    });

    return res.status(201).send(createdProduct);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).send(products);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

// Get a product by id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id },
    });
    if (!product) {
      return res.status(404).send("Product not found!");
    }
    return res.status(200).send(product);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

// Update a product by id
exports.updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      brand,
      category,
      unit,
      minimumQty,
      barcode,
      description,
      imageUrl,
      price,
      tax,
      purchasePrice,
      taxType,
      profitMargin,
      salesPrice,
      finalPrice,
      discountType,
      discount,
      currentOpeningStock,
    } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).send("Product not found!");
    }

    if (product) {
      name ? (product.name = name) : product.name;
      brand ? (product.brand = brand) : product.brand;
      category ? (product.category = category) : product.category;
      unit ? (product.unit = unit) : product.unit;
      minimumQty ? (product.minimumQty = minimumQty) : product.minimumQty;
      barcode ? (product.barcode = barcode) : product.barcode;
      description ? (product.description = description) : product.description;
      imageUrl ? (product.imageUrl = imageUrl) : product.imageUrl;
      price ? (product.price = price) : product.price;
      tax ? (product.tax = tax) : product.tax;
      purchasePrice
        ? (product.purchasePrice = purchasePrice)
        : product.purchasePrice;
      taxType ? (product.taxType = taxType) : product.taxType;
      profitMargin
        ? (product.profitMargin = profitMargin)
        : product.profitMargin;
      salesPrice ? (product.salesPrice = salesPrice) : product.salesPrice;
      finalPrice ? (product.finalPrice = finalPrice) : product.finalPrice;
      discountType
        ? (product.discountType = discountType)
        : product.discountType;
      discount ? (product.discount = discount) : product.discount;
      currentOpeningStock
        ? (product.currentOpeningStock = currentOpeningStock)
        : product.currentOpeningStock;

      await product.save();

      return res.status(200).send({
        message: "Product updated successfully",
        product: product,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

// Delete a product by id
exports.deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).send("Product not found!");
    }

    await product.destroy();

    return res.status(200).send({
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};
