const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user.routes");
const customerRoutes = require("./routes/customer.routes");
const supplierRoutes = require("./routes/supplier.routes");
const purchaseRoutes = require("./routes/purchase.routes");
const purchaseReturnRoutes = require("./routes/purchaseReturn.routes");
const expenseCategoryRoutes = require("./routes/expenseCategory.routes");
const expenseRoutes = require("./routes/expense.routes");
const brandsRoutes = require("./routes/brands.routes");
const productsCategoryRoutes = require("./routes/productsCategory.routes");
const unitsRoutes = require("./routes/units.routes");
const paymentTypesRoutes = require("./routes/paymentTypes.routes");
const taxRoutes = require("./routes/tax.routes");
const productsRoutes = require("./routes/products.routes");

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the application." });
});

app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/purchaseReturns", purchaseReturnRoutes);
app.use("/api/expenseCategories", expenseCategoryRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/brands", brandsRoutes);
app.use("/api/productsCategories", productsCategoryRoutes);
app.use("/api/units", unitsRoutes);
app.use("/api/paymentTypes", paymentTypesRoutes);
app.use("/api/taxes", taxRoutes);
app.use("/api/products", productsRoutes);

const sequelize = require("./config/db.config");

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}.`);

  // Test the database connection
  try {
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
});
