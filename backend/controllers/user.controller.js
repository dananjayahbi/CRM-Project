const path = require("path");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require('fs');

// Set up multer for file handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../assets/users"));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

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

exports.createUser = [
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const { firstName, lastName, username, email, password, role, mobile } =
        req.body;

      if (
        !firstName ||
        !lastName ||
        !username ||
        !email ||
        !password ||
        !role ||
        !mobile
      ) {
        return res.status(400).send("All fields are required");
      }

      // Find if any user already exists with the provided email
      const existing = await User.findOne({ email });
      if (existing) {
        return res
          .status(400)
          .send("User already exists with the provided email");
      }

      // Handling file upload
      let profilePictureUrl = "";
      if (req.file) {
        const filename = req.file.filename;
        profilePictureUrl = `/assets/users/${filename}`;
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        role,
        mobile,
        profilePicture: profilePictureUrl,
        isActive: true,
      });

      res.status(201).send("User created successfully");
    } catch (err) {
      console.error("Unable to connect to the database:", err);
      res.status(500).send("Internal Server Error");
    }
  },
];

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("All fields are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found with the provided email");
    }

    if (user.isActive === false) {
      return res.status(403).send("User is not active");
    }

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      //Compair the hashed password with the provided password
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        res.status(200).json({ message: "Login Successful!", user, token });
      } else {
        res.status(401).send("Invalid credentials");
      }
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Get a token
exports.getNewToken = async (req, res) => {
  try {
    const userId = req.params.id;
    if (userId) {
      const userFetch = await User.findById(userId);
      if (userFetch) {
        //generate token
        const token = jwt.sign({ id: userFetch._id }, process.env.JWT_SECRET, {
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
        errorMessage: "User ID is required",
      });
    }
  } catch (err) {
    res.status(401).json({
      errorMessage: "Something went wrong!\n" + err,
    });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Get a user by id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Update a user by id
exports.updateUser = [
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        username,
        email,
        password,
        role,
        mobile,
        isActive,
      } = req.body;

      const user = await User.findById(req.params.id);

      if (user) {
        // Update user details
        firstName ? (user.firstName = firstName) : user.firstName;
        lastName ? (user.lastName = lastName) : user.lastName;
        username ? (user.username = username) : user.username;
        email ? (user.email = email) : user.email;
        role ? (user.role = role) : user.role;
        mobile ? (user.mobile = mobile) : user.mobile;
        isActive ? (user.isActive = isActive) : user.isActive;

        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword;
        }

        // Handle profile picture update
        if (req.file) {
          // Remove the old profile picture if it exists
          if (user.profilePicture) {
            const oldFilePath = path.join(__dirname, "../assets/users", path.basename(user.profilePicture));
            fs.unlink(oldFilePath, (err) => {
              if (err) {
                console.error("Error deleting old profile picture:", err);
              }
            });
          }

          // Save new profile picture
          const filename = req.file.filename;
          user.profilePicture = `/assets/users/${filename}`;
        }

        await user.save();
        res.status(200).json({ message: "User updated successfully", user });
      } else {
        res.status(404).send("User not found");
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
];

//Todo : Password reset

// Delete a user by id
exports.deleteUser = async (req, res) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.params.id);
    
    if (user) {
      // Remove the profile picture if it exists
      if (user.profilePicture) {
        const filePath = path.join(__dirname, "../assets/users", path.basename(user.profilePicture));
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting profile picture:", err);
          }
        });
      }
      
      // Delete the user record
      await User.findByIdAndDelete(req.params.id);
      res.status(200).send("User deleted successfully");
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};