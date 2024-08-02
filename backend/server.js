const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

//Setting up the server
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8060;
const DbURL = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

//Setting up routing
app.get("/", (req, res) => {
  res.send({ message: "Hello World!" });
});

// app.use("/users", require("./routes/UserRoutes"));

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
