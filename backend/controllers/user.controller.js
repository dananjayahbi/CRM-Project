const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Create the default super-admin user
exports.createDefaultAdmin = async (req, res) => {
  try {
    const defaultUser = await User.findOne({ role: "superAdmin" });
    if (!defaultUser) {
      const hashedPassword = await bcrypt.hash("admin", 10);
      await User.create({
        firstName: "Default",
        lastName: "Super-Admin",
        username: "defAdmin",
        email: "admin@def.com",
        password: hashedPassword,
        role: "superAdmin",
        mobile: "1234567890",
        profilePicture: "",
        isActive: true,
      });

      res.status(201).send("Default super-admin created successfully");
    } else {
      res.status(200).send("Default super-admin already exists");
    }
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};
