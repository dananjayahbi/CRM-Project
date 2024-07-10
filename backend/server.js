const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user.routes");
const dbConfig = require("./config/db.config");
const { Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the application." });
});

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}.`);

  // Initialize Sequelize
  const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
      host: dbConfig.HOST,
      dialect: dbConfig.dialect,
      pool: dbConfig.pool,
    }
  );

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
