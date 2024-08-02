const router = require("express").Router();
const { protect } = require("../middleware/authorization");

const {
    createPurchase,


} = require("../controllers/purchase.controller");

// Create a new purchase
// router.post("/createPurchase", protect, createPurchase);
router.post("/createPurchase", createPurchase);



module.exports = router;