const Supplier = require("../models/Supplier.model");

// Create a new supplier
exports.createSupplier = async (req, res) => {
  try {
    const { name, email, mobile, address } = req.body;

    if (!name || !email || !mobile) {
      return res.status(400).send("Some Fields are missing");
    }

    // Find if any supplier already exists with the provided email
    const supplierByEmail = await Supplier.findOne({ email });
    if (supplierByEmail) {
      return res
        .status(400)
        .send("Supplier already exists with the provided email");
    }

    // Find if any supplier already exists with the provided mobile
    const supplierByMobile = await Supplier.findOne({ mobile });
    if (supplierByMobile) {
      return res
        .status(400)
        .send("Supplier already exists with the provided mobile number");
    }

    const supplier = new Supplier({
      name,
      email,
      mobile,
      address: address ? address : null,
    });

    const createdSupplier = await supplier.save();
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
    const suppliers = await Supplier.find();
    res.status(200).send(suppliers);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Get a supplier by id
exports.getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findById(id);
    res.status(200).send(supplier);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Update a supplier by id
exports.updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile, address } = req.body;

    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).send("Supplier not found");
    }

    if (email && email !== supplier.email) {
      const supplierByEmail = await Supplier.findOne({ email });
      if (supplierByEmail) {
        return res
          .status(400)
          .send("Supplier already exists with the provided email");
      }
    }

    if (mobile && mobile !== supplier.mobile) {
      const supplierByMobile = await Supplier.findOne({ mobile });
      if (supplierByMobile) {
        return res
          .status(400)
          .send("Supplier already exists with the provided mobile number");
      }
    }

    if (supplier) {
      supplier.name = name || supplier.name;
      supplier.email = email || supplier.email;
      supplier.mobile = mobile || supplier.mobile;
      supplier.address = address !== undefined ? address : supplier.address;

      const updatedSupplier = await supplier.save();

      res.status(200).send({
        message: "Supplier updated successfully",
        supplier: updatedSupplier,
      });
    }
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Delete a supplier by id
exports.deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findByIdAndDelete(id);
    if (!supplier) {
      return res.status(404).send("Supplier not found");
    }
    res.status(200).send({
      message: "Supplier deleted successfully"
    });
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};
