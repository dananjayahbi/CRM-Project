const Sales = require("../models/Sales.model");

// Create a new sale
exports.createSale = async (req, res) => {
  try {
    const { customer, saleDate, status, products, grandTotal } = req.body;

    if (!customer || !saleDate || !status || !products || !grandTotal) {
      return res.status(400).send("All input is required");
    }

    const newSale = new Sales({
      customer,
      saleDate,
      status,
      products,
      grandTotal,
    });

    //Check if the products array is empty
    if (products.length === 0) {
      return res.status(400).send("Products array cannot be empty");
    }

    const createdSale = await newSale.save();
    res.status(201).send({
      message: "Sale created successfully",
      sale: createdSale,
    });
  } catch (err) {
    res.status(500).send({
      message: "Some error occurred while creating the sale.",
      err,
    });
  }
};

// Get all sales
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sales.find();
    res.status(200).send(sales);
  } catch (err) {
    res.status(500).send({
      message: "Some error occurred while retrieving sales.",
    });
  }
};

// Get a sale by id
exports.getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const saleById = await Sales.findById(id);
    res.status(200).send(saleById);
  } catch (err) {
    res.status(500).send({
      message: "Some error occurred while retrieving sale.",
    });
  }
};

// Update a sale
exports.updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { customer, saleDate, status, products, grandTotal } = req.body;

    const sale = await Sales.findById(id);
    if (!sale) {
      return res.status(404).send("Sale not found");
    }

    // If the products array is empty, return an error
    if (products && products.length === 0) {
      return res.status(400).send("Products array cannot be empty");
    }

    if (products) {
      // If the products array provides a new product, then add it to the products object array
      products.forEach((newProduct) => {
        const existingProductIndex = sale.products.findIndex(
          (p) => p.productObjectId.toString() === newProduct.productObjectId
        );

        if (existingProductIndex === -1) {
          // Add new product
          sale.products.push(newProduct);
        } else {
          // Update existing product
          sale.products[existingProductIndex] = {
            ...sale.products[existingProductIndex].toObject(),
            ...newProduct,
          };
        }
      });

      // If the provided products array misses a product that is in the database, it means that product is deleted
      const updatedProductIds = products.map((p) =>
        p.productObjectId.toString()
      );
      sale.products = sale.products.filter((p) =>
        updatedProductIds.includes(p.productObjectId.toString())
      );
    }

    // Update other fields
    if (customer) sale.customer = customer;
    if (saleDate) sale.saleDate = saleDate;
    if (status) sale.status = status;
    if (grandTotal) sale.grandTotal = grandTotal;

    const updatedSale = await sale.save();

    return res.status(200).send({
      message: "Sale updated successfully",
      sale: updatedSale,
    });
  } catch (err) {
    res.status(500).send({
      message: "Some error occurred while updating the sale.",
      err,
    });
  }
};

// Delete a sale
exports.deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sales.findById(id);
    if (!sale) {
      return res.status(404).send("Sale not found");
    }
    await Sales.findByIdAndDelete(id);
    res.status(200).send("Sale deleted successfully");
  } catch (err) {
    res.status(500).send({
      message: "Some error occurred while deleting the sale.",
    });
  }
};
