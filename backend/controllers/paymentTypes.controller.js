const sequelize = require("../config/db.config");

const PaymentType = require("../models/paymentTypes.model");
sequelize.sync({ force: false });

// Create a new payment type
exports.createPaymentType = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).send("Payment type name is required");
    }

    // Check if the payment type already exists
    const existingPaymentType = await PaymentType.findOne({ where: { name } });
    if (existingPaymentType) {
      return res.status(400).send("Payment type already exists");
    }

    const paymentType = await PaymentType.create({
      name,
    });

    res.status(201).send(paymentType);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get all payment types
exports.getAllPaymentTypes = async (req, res) => {
  try {
    const paymentTypes = await PaymentType.findAll();
    res.status(200).send(paymentTypes);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get a payment type by id
exports.getPaymentTypeById = async (req, res) => {
  try {
    const paymentType = await PaymentType.findByPk(req.params.id);
    if (!paymentType) {
      return res.status(404).send("Payment type not found");
    }
    res.status(200).send(paymentType);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update a payment type by id
exports.updatePaymentType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const paymentType = await PaymentType.findByPk(id);
    if (!paymentType) {
      return res.status(404).send("Payment type not found");
    }

    if (paymentType) {
      name ? (paymentType.name = name) : paymentType.name;

      await paymentType.save();

      res.status(200).send({
        message: "Payment type updated successfully",
        data: paymentType,
      });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Delete a payment type by id
exports.deletePaymentType = async (req, res) => {
  try {
    const { id } = req.params;

    const paymentType = await PaymentType.findByPk(id);
    if (!paymentType) {
      return res.status(404).send("Payment type not found");
    }

    await paymentType.destroy();

    res.status(200).send("Payment type deleted successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
