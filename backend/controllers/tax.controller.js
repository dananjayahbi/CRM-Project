const Tax = require("../models/Tax.model");

// Create a new tax
exports.createTax = async (req, res) => {
  try {
    const { taxName, taxRate } = req.body;

    if (!taxName || !taxRate) {
      return res.status(400).send("Tax name and tax rate are required");
    }

    // Find if any tax already exists with the provided name
    const taxByName = await Tax.findOne({ taxName });
    if (taxByName) {
      return res.status(400).send("Tax already exists with the provided name");
    }

    const tax = new Tax({
      taxName,
      taxRate,
    });

    const createdTax = await tax.save();
    res.status(201).send({
      message: "Tax created successfully",
      tax: createdTax,
    });
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Get all taxes
exports.getAllTaxes = async (req, res) => {
  try {
    const taxes = await Tax.find();
    res.status(200).send(taxes);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Get a tax by id
exports.getTaxById = async (req, res) => {
  try {
    const { id } = req.params;
    const tax = await Tax.findById(id);
    res.status(200).send(tax);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Update a tax
exports.updateTax = async (req, res) => {
  try {
    const { id } = req.params;
    const { taxName, taxRate } = req.body;

    const tax = await Tax.findById(id);
    if (!tax) {
      return res.status(404).send("Tax not found");
    }

    // Find if any tax already exists with the provided name
    if (taxName) {
      const taxByName = await Tax.findOne({ tax });
      if (taxByName) {
        return res
          .status(400)
          .send("Tax already exists with the provided name");
      }
    }

    if (tax) {
      tax.taxName = taxName || tax.taxName;
      tax.taxRate = taxRate || tax.taxRate;

      const updatedTax = await tax.save();
      res.status(200).send({
        message: "Tax updated successfully",
        tax: updatedTax,
      });
    }
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Delete a tax
exports.deleteTax = async (req, res) => {
  try {
    const { id } = req.params;
    const tax = await Tax.findByIdAndDelete(id);
    if (!tax) {
      return res.status(404).send("Tax not found");
    }
    res.status(200).send("Tax deleted successfully");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};
