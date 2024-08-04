const Customer = require("../models/Customer.model");

// Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    const { name, email, mobile, address, nic } = req.body;

    if (!name || !email || !mobile) {
      return res.status(400).send("Some Fields are missing");
    }

    // Find if any customer already exists with the provided email
    const customerByEmail = await Customer.findOne({ email });
    if (customerByEmail) {
      return res
        .status(400)
        .send("Customer already exists with the provided email");
    }

    // Find if any customer already exists with the provided mobile
    const customerByMobile = await Customer.findOne({ mobile });
    if (customerByMobile) {
      return res
        .status(400)
        .send("Customer already exists with the provided mobile number");
    }

    const customer = new Customer({
      name,
      email,
      mobile,
      address: address ? address : null,
      nic: nic ? nic : null,
    });

    const createdCustomer = await customer.save();
    res.status(201).send({
      message: "Customer created successfully",
      customer: createdCustomer,
    });
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).send(customers);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Get a customer by id
exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).send("Customer not found");
    }
    res.status(200).send(customer);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Update a customer by id
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile, address, nic } = req.body;

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).send("Customer not found");
    }

    if (email && email !== customer.email) {
      const customerByEmail = await Customer.findOne({ email });
      if (customerByEmail) {
        return res
          .status(400)
          .send("Customer already exists with the provided email");
      }
    }

    if (mobile && mobile !== customer.mobile) {
      const customerByMobile = await Customer.findOne({ mobile });
      if (customerByMobile) {
        return res
          .status(400)
          .send("Customer already exists with the provided mobile number");
      }
    }

    if (customer) {
      name ? (customer.name = name) : customer.name;
      email ? (customer.email = email) : customer.email;
      mobile ? (customer.mobile = mobile) : customer.mobile;
      address ? (customer.address = address) : customer.address;
      nic ? (customer.nic = nic) : customer.nic;

      const updatedCustomer = await customer.save();

      return res.status(200).send({
        message: "Customer updated successfully",
        customer: updatedCustomer,
      });
    }
  } catch (err) {
    res.status(500).send("Unable to update the customer", err);
  }
};

// Delete a customer by id
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      return res.status(404).send("Customer not found");
    }
    res.status(200).send("Customer deleted successfully");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};
