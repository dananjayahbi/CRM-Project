const router = require("express").Router();
const { protect } = require("../middleware/authorization");

const {
    createUnit,
    getAllUnits,
    getUnitById,
    updateUnit,
    deleteUnit,
} = require("../controllers/units.controller");

// Create a new unit
// router.post("/createUnit", protect, createUnit);
router.post("/createUnit", createUnit);

// Get all units
// router.get("/getAllUnits", protect, getAllUnits);
router.get("/getAllUnits", getAllUnits);

// Get a unit by id
// router.get("/getUnitById/:id", protect, getUnitById);
router.get("/getUnitById/:id", getUnitById);

// Update a unit
// router.put("/updateUnit/:id", protect, updateUnit);
router.put("/updateUnit/:id", updateUnit);

// Delete a unit
// router.delete("/deleteUnit/:id", protect, deleteUnit);
router.delete("/deleteUnit/:id", deleteUnit);

module.exports = router;