const sequelize = require("../config/db.config");

const ProductsCategory = require("../models/productsCategory.model");
sequelize.sync({ force: false });

// Create a new products category
exports.createProductsCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).send("Products category name is required");
    }

    const productsCategory = await ProductsCategory.create({
      name,
      description: description ? description : "",
    });

    res.status(201).send(productsCategory);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get all products categories
exports.getAllProductsCategories = async (req, res) => {
  try {
    const productsCategories = await ProductsCategory.findAll();
    res.status(200).send(productsCategories);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get a products category by id
exports.getProductsCategoryById = async (req, res) => {
  try {
    const productsCategory = await ProductsCategory.findByPk(req.params.id);
    if (!productsCategory) {
      return res.status(404).send("Products category not found");
    }
    res.status(200).send(productsCategory);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update a products category by id
exports.updateProductsCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const productsCategory = await ProductsCategory.findByPk(id);
    if (!productsCategory) {
      return res.status(404).send("Products category not found");
    }

    if (productsCategory) {
      name ? (productsCategory.name = name) : productsCategory.name;
      description ? (productsCategory.description = description) : "";

      await productsCategory.save();

      res.status(200).send({
        message: "Products category updated successfully",
        data: productsCategory,
      });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Delete a products category by id
exports.deleteProductsCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const productsCategory = await ProductsCategory.findByPk(id);
    if (!productsCategory) {
      return res.status(404).send("Products category not found");
    }

    await productsCategory.destroy();
    res.status(200).send("Products category deleted successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
