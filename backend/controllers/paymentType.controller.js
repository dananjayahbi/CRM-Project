const PaymentType = require("../models/PaymentType.model");

// Create a new payment type
exports.createPaymentType = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).send("Payment type name is required");
    }

    // Find if any payment type already exists with the provided name
    const paymentTypeByName = await PaymentType.findOne({ name });
    if (paymentTypeByName) {
      return res
        .status(400)
        .send("Payment type already exists with the provided name");
    }

    const paymentType = new PaymentType({
      name,
    });

    const createdPaymentType = await paymentType.save();
    res.status(201).send({
      message: "Payment type created successfully",
      paymentType: createdPaymentType,
    });
  } catch (err) {
    console.error("Unable to connect to the database:", err);
    res.status(500).send({
      message: "Some error occurred while creating the payment type.",
    });
  }
};

// Get all payment types
exports.getAllPaymentTypes = async (req, res) => {
  try {
    const paymentTypes = await PaymentType.find();
    res.status(200).send(paymentTypes);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Get a payment type by id
exports.getPaymentTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const paymentType = await PaymentType.findById(id);
    res.status(200).send(paymentType);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Update a payment type
exports.updatePaymentType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const paymentType = await PaymentType.findById(id);
    if (!paymentType) {
      return res.status(404).send("Payment type not found");
    }

    //Find if any payment type already exists with the provided name
    const paymentTypeByName = await PaymentType.findOne({ name });
    if (paymentTypeByName && paymentTypeByName._id.toString() !== id) {
      return res
        .status(400)
        .send("Payment type already exists with the provided name");
    }

    if (paymentType) {
      paymentType.name = name || paymentType.name;

      const updatedPaymentType = await paymentType.save();

      return res.status(200).send({
        message: "Payment type updated successfully",
        paymentType: updatedPaymentType,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Some error occurred while updating the payment type.",
    });
  }
};

// Delete a payment type
exports.deletePaymentType = async (req, res) => {
  try {
    const { id } = req.params;
    const paymentType = await PaymentType.findByIdAndDelete(id);
    if (!paymentType) {
      return res.status(404).send("Payment type not found");
    }
    res.status(200).send("Payment type deleted successfully");
  } catch (err) {
    res.status(500).send({
      message: "Some error occurred while deleting the payment type.",
    });
  }
};
