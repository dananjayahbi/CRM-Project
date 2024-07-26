const router = require("express").Router();
const { protect } = require("../middleware/authorization");

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} = require("../controllers/products.controller");

// create a new product
// router.post("/createProduct", protect, createProduct);
router.post("/createProduct", createProduct);

// get all products
// router.get("/getAllProducts", protect, getAllProducts);
router.get("/getAllProducts", getAllProducts);

// get a product by id
// router.get("/getProductById/:id", protect, getProductById);
router.get("/getProductById/:id", getProductById);

// update a product by id
// router.put("/updateProduct/:id", protect, updateProductById);
router.put("/updateProduct/:id", updateProductById);

// delete a product by id
// router.delete("/deleteProduct/:id", protect, deleteProductById);
router.delete("/deleteProduct/:id", deleteProductById);

module.exports = router;