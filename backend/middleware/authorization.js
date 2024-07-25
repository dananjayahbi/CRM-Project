const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
      console.log("Token:", token);

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token using Sequelize
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      });

      if (!req.user) {
        return res.status(404).json({ status: "Error", data: "User not found" });
      }

      next();
    } catch (error) {
      console.error("JWT Verification Error:", error);
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ status: "Error", data: "Token expired" });
      } else {
        return res.status(401).json({ status: "Error", data: "Invalid token" });
      }
    }
  } else {
    res.status(401).json("No token!");
  }
};

module.exports = { protect };
