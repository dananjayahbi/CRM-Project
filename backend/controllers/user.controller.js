const sequelize = require("../config/db.config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
sequelize.sync({ force: false });

// Create the default super-admin user
exports.createDefaultAdmin = async (req, res) => {
  try {
    const defaultUser = await User.findOne({ where: { role: "superAdmin" } });
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

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      role,
      mobile,
      profilePicture,
    } = req.body;

    if (!firstName || !lastName || !username || !email || !password || !role || !mobile) {
      return res.status(400).send("All fields are required");
    }

    // Find if any user already exists with the provided email
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res
        .status(409)
        .send("User already exists with the provided email");
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      role,
      mobile,
      profilePicture: profilePicture ? profilePicture : "default.jpg",
      isActive: true,
    });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    if (user.isActive === false) {
      return res.status(403).send("User is inactive");
    }

    if (user) {
      // Generate and send the JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      // Compare the hashed password with the provided password
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        res.status(200).json({ message: "Login successful", user, token });
      } else {
        res.status(401).send("Invalid credentials");
      }
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//Get a token
exports.getNewToken = async (req, res) => {
  try {
    const userId = req.params.id; // Access the "id" from the URL parameter
    if (userId) {
      const userFetch = await User.findByPk( userId );
      if (userFetch) {
        // generate token
        const token = jwt.sign({ id: userFetch.id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        res.json(token);
      } else {
        res.status(404).json({
          errorMessage: "User not found",
        });
      }
    } else {
      res.status(400).json({
        errorMessage: "Id not found in URL parameter",
      });
    }
  } catch (e) {
    res.status(401).json({
      errorMessage: "Something went wrong!\n" + e,
    });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Get a user by id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      role,
      mobile,
      profilePicture,
      isActive,
    } = req.body;
    const user = await User.findByPk(req.params.id);
    if (user) {
      firstName ? (user.firstName = firstName) : user.firstName;
      lastName ? (user.lastName = lastName) : user.lastName;
      username ? (user.username = username) : user.username;
      email ? (user.email = email) : user.email;
      role ? (user.role = role) : user.role;
      mobile ? (user.mobile = mobile) : user.mobile;
      profilePicture
        ? (user.profilePicture = profilePicture)
        : user.profilePicture;
      isActive ? (user.isActive = isActive) : user.isActive;

      if (password) {
        // Hash the password before updating
        user.password = await bcrypt.hash(password, 10);
      }
      await user.save();
      res.status(200).json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.status(200).send("User deleted successfully");
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};
