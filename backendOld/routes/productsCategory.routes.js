const router = require("express").Router();
const { protect } = require("../middleware/authorization");

const {
    createProductsCategory,
    getAllProductsCategories,
    getProductsCategoryById,
    updateProductsCategory,
    deleteProductsCategory,
} = require("../controllers/productsCategory.controller");

// Create a new products category
// router.post("/createProductsCategory", protect, createProductsCategory);
router.post("/createProductsCategory", createProductsCategory);

// Get all products categories
// router.get("/getAllProductsCategories", protect, getAllProductsCategories);
router.get("/getAllProductsCategories", getAllProductsCategories);

// Get a products category by id
// router.get("/getProductsCategoryById/:id", protect, getProductsCategoryById);
router.get("/getProductsCategoryById/:id", getProductsCategoryById);

// Update a products category
// router.put("/updateProductsCategory/:id", protect, updateProductsCategory);
router.put("/updateProductsCategory/:id", updateProductsCategory);

// Delete a products category
// router.delete("/deleteProductsCategory/:id", protect, deleteProductsCategory);
router.delete("/deleteProductsCategory/:id", deleteProductsCategory);

module.exports = router;