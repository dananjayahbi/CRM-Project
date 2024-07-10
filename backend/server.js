const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user.routes");
const customerRoutes = require("./routes/customer.routes");

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the application." });
});

app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);

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
