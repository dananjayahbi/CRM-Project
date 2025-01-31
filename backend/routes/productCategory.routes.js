const router = require("express").Router();
const { protect } = require("../middleware/authorization");

const {
    createProductCategory,
    getAllProductCategories,
    getProductCategoryById,
    updateProductCategory,
    deleteProductCategory,
} = require("../controllers/productCategory.controller");

// Create a new product category
// router.post("/createProductCategory", protect, createProductCategory);
router.post("/createProductCategory", createProductCategory);

// Get all product categories
// router.get("/getAllProductCategories", protect, getAllProductCategories);
router.get("/getAllProductCategories", getAllProductCategories);

// Get a product category by id
// router.get("/getProductCategoryById/:id", protect, getProductCategoryById);
router.get("/getProductCategoryById/:id", getProductCategoryById);

// Update a product category
// router.put("/updateProductCategory/:id", protect, updateProductCategory);
router.put("/updateProductCategory/:id", updateProductCategory);

// Delete a product category
// router.delete("/deleteProductCategory/:id", protect, deleteProductCategory);
router.delete("/deleteProductCategory/:id", deleteProductCategory);

module.exports = router;