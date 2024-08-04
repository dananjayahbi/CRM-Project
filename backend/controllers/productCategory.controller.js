const ProductCategory = require("../models/ProductCategory.model");

// Create a new product category
exports.createProductCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).send("Product category name is required");
    }

    // Find if any product category already exists with the provided name
    const productCategoryByName = await ProductCategory.findOne({ name });
    if (productCategoryByName) {
      return res
        .status(400)
        .send("Product category already exists with the provided name");
    }

    const productCategory = new ProductCategory({
      name,
      description: description ? description : "",
    });

    const createdProductCategory = await productCategory.save();
    res.status(201).send({
      message: "Product category created successfully",
      productCategory: createdProductCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all product categories
exports.getAllProductCategories = async (req, res) => {
  try {
    const productCategories = await ProductCategory.find();
    res.status(200).send(productCategories);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a product category by id
exports.getProductCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const productCategory = await ProductCategory.findById(id);
    res.status(200).send(productCategory);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a product category
exports.updateProductCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const productCategory = await ProductCategory.findById(id);
    if (!productCategory) {
      return res.status(404).send("Product category not found");
    }

    // Find if any product category already exists with the provided name
    const productCategoryByName = await ProductCategory.findOne({ name });
    if (productCategoryByName && productCategoryByName._id.toString() != id) {
      return res
        .status(400)
        .send("Product category already exists with the provided name");
    }

    if (productCategory) {
      name ? (productCategory.name = name) : productCategory.name;
      description
        ? (productCategory.description = description)
        : productCategory.description;

      const updatedProductCategory = await productCategory.save();

      res.status(200).send({
        message: "Product category updated successfully",
        productCategory: updatedProductCategory,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a product category
exports.deleteProductCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const productCategory = await ProductCategory.findByIdAndDelete(id);
    if (!productCategory) {
      return res.status(404).send("Product category not found");
    }
    res.status(200).send({
      message: "Product category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
