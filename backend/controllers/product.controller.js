const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const Product = require("../models/Product.model");

// Set up multer for file handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../assets/products"));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

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
exports.createProduct = [
  upload.single("image"),
  async (req, res) => {
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

      // Handling file upload
      let imageUrl = "";
      if (req.file) {
        const filename = req.file.filename;
        imageUrl = `/assets/products/${filename}`;
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
        imageUrl: imageUrl,
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
  },
];

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

// Get a product by id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).send(product);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

// Update a product
exports.updateProductById = [
  upload.single("image"),
  async (req, res) => {
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

      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).send("Product not found!");
      }

      // Handling file upload
      if (req.file) {
        // Save new image and delete the old one
        const filename = req.file.filename;
        const imageUrl = `/assets/products/${filename}`;
        const oldImageUrl = product.imageUrl;

        // Set new image URL
        product.imageUrl = imageUrl;

        // Delete old image file if it exists
        if (oldImageUrl) {
          const oldImagePath = path.join(__dirname, "..", oldImageUrl);
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              console.error("Failed to delete old image:", err);
            }
          });
        }
      }

      // Update other fields
      name ? (product.name = name) : product.name;
      brand ? (product.brand = brand) : product.brand;
      category ? (product.category = category) : product.category;
      unit ? (product.unit = unit) : product.unit;
      minimumQty ? (product.minimumQty = minimumQty) : product.minimumQty;
      barcode ? (product.barcode = barcode) : product.barcode;
      description ? (product.description = description) : product.description;
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
    } catch (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
  },
];

// Delete a product
exports.deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send("Product not found!");
    }

    if (product.imageUrl !== "") {
      // Get the image URL from the product
      const imageUrl = product.imageUrl;

      // Delete the image file from the folder
      if (imageUrl) {
        const imagePath = path.join(__dirname, "..", imageUrl);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Failed to delete image:", err);
          }
        });
      }
    }

    // Delete the product from the database
    const deleteProduct = await Product.findByIdAndDelete(id);
    if (!deleteProduct) {
      return res.status(404).send("Product not found!");
    }
    return res.status(200).send({
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};
