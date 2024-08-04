const router = require("express").Router();
const { protect } = require("../middleware/authorization");

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProductById,
    deleteProductById,
} = require("../controllers/product.controller");

// Create a new product
// router.post("/createProduct", protect, createProduct);
router.post("/createProduct", createProduct);

// Get all products
// router.get("/getAllProducts", protect, getAllProducts);
router.get("/getAllProducts", getAllProducts);

// Get a product by id
// router.get("/getProductById/:id", protect, getProductById);
router.get("/getProductById/:id", getProductById);

// Update a product
// router.put("/updateProduct/:id", protect, updateProductById);
router.put("/updateProduct/:id", updateProductById);

// Delete a product
// router.delete("/deleteProduct/:id", protect, deleteProductById);
router.delete("/deleteProduct/:id", deleteProductById);

module.exports = router;