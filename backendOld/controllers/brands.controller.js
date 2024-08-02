const sequelize = require("../config/db.config");

const Brand = require("../models/brands.model");
sequelize.sync({ force: false });

// Create a new brand
exports.createBrand = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).send("Brand name is required");
    }

    const brand = await Brand.create({
      name,
      description: description ? description : "",
    });

    res.status(201).send(brand);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get all brands
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll();
    res.status(200).send(brands);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get a brand by id
exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) {
      return res.status(404).send("Brand not found");
    }
    res.status(200).send(brand);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update a brand by id
exports.updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const brand = await Brand.findByPk(id);
    if (!brand) {
      return res.status(404).send("Brand not found");
    }

    if (brand) {
      name ? (brand.name = name) : brand.name;
      description ? (brand.description = description) : brand.description;

      await brand.save();

      res.status(200).send({
        message: "Brand updated successfully",
        brand: brand,
      });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Delete a brand by id
exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByPk(id);
    if (!brand) {
      return res.status(404).send("Brand not found");
    }

    await brand.destroy();

    res.status(200).send({
      message: "Brand deleted successfully",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
