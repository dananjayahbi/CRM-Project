const sequelize = require("../config/db.config");

const Tax = require("../models/tax.model");
sequelize.sync({ force: false });

// Create a new tax
exports.createTax = async (req, res) => {
  try {
    const { taxName, taxRate } = req.body;

    if (!taxName || !taxRate) {
      return res.status(400).send("All fields are required");
    }

    const createdTax = await Tax.create({
      taxName,
      taxRate,
    });

    return res.status(201).send(createdTax);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

// Get all taxes
exports.getAllTaxes = async (req, res) => {
  try {
    const taxes = await Tax.findAll();
    return res.status(200).send(taxes);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

// Get tax by id
exports.getTaxById = async (req, res) => {
  try {
    const tax = await Tax.findByPk(req.params.id);
    if (!tax) {
      return res.status(404).send("Tax not found");
    }
    return res.status(200).send(tax);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

// Update tax by id
exports.updateTax = async (req, res) => {
  try {
    const tax = await Tax.findByPk(req.params.id);
    if (!tax) {
      return res.status(404).send("Tax not found");
    }

    const { taxName, taxRate } = req.body;

    if(tax){
        taxName ? (tax.taxName = taxName) : tax.taxName;
        taxRate ? (tax.taxRate = taxRate) : tax.taxRate;

        await tax.save();

        return res.status(200).send({
            message: "Tax updated successfully",
            tax,
        });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

// Delete tax by id
exports.deleteTax = async (req, res) => {
  try {
    const tax = await Tax.findByPk(req.params.id);
    if (!tax) {
      return res.status(404).send("Tax not found");
    }

    await tax.destroy();

    return res.status(200).send("Tax deleted successfully");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};