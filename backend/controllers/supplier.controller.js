const sequelize = require("../config/db.config");

const Supplier = require("../models/supplier.model");
sequelize.sync({ force: false });

// Create a new supplier
exports.createSupplier = async (req, res) => {
  try {
    const { name, email, mobile, address, nic } = req.body;

    if (!name || !email || !mobile) {
      return res.status(400).send("All fields are required");
    }

    // Find if any supplier already exists with the provided email
    const supplierByEmail = await Supplier.findOne({ where: { email } });
    if (supplierByEmail) {
      return res
        .status(400)
        .send("Supplier already exists with the provided email");
    }

    // Find if any supplier already exists with the provided mobile
    const supplierByMobile = await Supplier.findOne({ where: { mobile } });
    if (supplierByMobile) {
      return res
        .status(400)
        .send("Supplier already exists with the provided mobile");
    }

    const createdSupplier = await Supplier.create({
      name,
      email,
      mobile,
      address: address ? address : null,
      nic: nic ? nic : null,
    });

    res.status(201).send({
      message: "Supplier created successfully",
      supplier: createdSupplier,
    });
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Get all suppliers
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll();
    res.status(200).send(suppliers);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Get a supplier by id
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({ where: { id: req.params.id } });
    if (!supplier) {
      return res.status(404).send("Supplier not found");
    }
    res.status(200).send(supplier);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Update a supplier by id
exports.updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile, address, nic } = req.body;

    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      return res.status(404).send("Supplier not found");
    }

    // Find if any supplier already exists with the provided email
    if (email && email !== supplier.email) {
      const supplierByEmail = await Supplier.findOne({ where: { email } });
      if (supplierByEmail) {
        return res
          .status(400)
          .send("Supplier already exists with the provided email");
      }
    }

    // Find if any supplier already exists with the provided mobile
    if (mobile && mobile !== supplier.mobile) {
      const supplierByMobile = await Supplier.findOne({ where: { mobile } });
      if (supplierByMobile) {
        return res
          .status(400)
          .send("Supplier already exists with the provided mobile");
      }
    }

    if (supplier) {
      name ? (supplier.name = name) : supplier.name;
      email ? (supplier.email = email) : supplier.email;
      mobile ? (supplier.mobile = mobile) : supplier.mobile;
      address ? (supplier.address = address) : supplier.address;
      nic ? (supplier.nic = nic) : supplier.nic;

      await supplier.save();

      res.status(200).send({
        message: "Supplier updated successfully",
        supplier: supplier,
      });
    }
  } catch (err) {
    console.error("Unable to update the supplier:", err);
  }
};

// Delete a supplier by id
exports.deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      return res.status(404).send("Supplier not found");
    }
    await supplier.destroy();
    res.status(200).send("Supplier deleted successfully");
  } catch (err) {
    console.error("Unable to delete the supplier:", err);
  }
};
