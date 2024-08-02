const router = require("express").Router();
const { protect } = require("../middleware/authorization");

const {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
} = require("../controllers/brands.controller");

// Create a new brand
// router.post("/createBrand", protect, createBrand);
router.post("/createBrand", createBrand);

// Get all brands
// router.get("/getAllBrands", protect, getAllBrands);
router.get("/getAllBrands", getAllBrands);

// Get a brand by id
// router.get("/getBrandById/:id", protect, getBrandById);
router.get("/getBrandById/:id", getBrandById);

// Update a brand
// router.put("/updateBrand/:id", protect, updateBrand);
router.put("/updateBrand/:id", updateBrand);

// Delete a brand
// router.delete("/deleteBrand/:id", protect, deleteBrand);
router.delete("/deleteBrand/:id", deleteBrand);

module.exports = router;