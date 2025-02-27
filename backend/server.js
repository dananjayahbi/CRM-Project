const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require('path');

//Setting up the server
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8060;
const DbURL = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

// Serve static files from the 'assets' directory
app.use('/assets/users', express.static(path.join(__dirname, './assets/users')));
app.use('/assets/products', express.static(path.join(__dirname, './assets/products')));

//Setting up routing
app.get("/", (req, res) => {
  res.send({ message: "Hello World!" });
});

app.use("/api/users", require("./routes/user.routes"));
app.use("/api/customers", require("./routes/customer.routes"));
app.use("/api/suppliers", require("./routes/supplier.routes"));
app.use("/api/expenseCategories", require("./routes/expenseCategory.routes"));
app.use("/api/expenses", require("./routes/expense.routes"));
app.use("/api/brands", require("./routes/brand.routes"));
app.use("/api/taxes", require("./routes/tax.routes"));
app.use("/api/units", require("./routes/unit.routes"));
app.use("/api/paymentTypes", require("./routes/paymentType.routes"));
app.use("/api/productsCategories", require("./routes/productCategory.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/purchases", require("./routes/purchase.routes"));
app.use("/api/purchaseReturns", require("./routes/purchaseReturn.routes"));
app.use("/api/sales", require("./routes/sales.routes"));

app.listen(PORT, () => {
  console.log("Server up with port : " + PORT);
});

// MongoDB connection
mongoose
  .connect(DbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
