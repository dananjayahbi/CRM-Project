const Brand = require("../models/Brand.model");

// Create a new brand
exports.createBrand = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).send("Brand name is required");
    }

    // Find if any brand already exists with the provided name
    const brandByName = await Brand.findOne({ name });
    if (brandByName) {
      return res
        .status(400)
        .send("Brand already exists with the provided name");
    }

    const brand = new Brand({
      name,
      description: description ? description : "",
    });

    const createdBrand = await brand.save();
    res.status(201).send({
      message: "Brand created successfully",
      brand: createdBrand,
    });
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Get all brands
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).send(brands);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Get a brand by id
exports.getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    res.status(200).send(brand);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Update a brand
exports.updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Find the brand
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).send("Brand not found");
    }

    if (brand) {
      name ? (brand.name = name) : brand.name;
      description ? (brand.description = description) : brand.description;

      const updatedBrand = await brand.save();
      res.status(200).send({
        message: "Brand updated successfully",
        brand: updatedBrand,
      });
    }
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Delete a brand
exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) {
      return res.status(404).send("Brand not found");
    }
    res.status(200).send("Brand deleted successfully");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};
