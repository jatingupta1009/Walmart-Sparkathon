const express = require("express");
const {
  createFamily,
  joinFamily,
  getMembers,
  getMyFamily,
  getFamilyCart,
  addQtyToFamilyCart,
  decreaseQtyFromFamilyCart,
  removeItemFromFamilyCart,
} = require("../controller/familyController");
const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

// Family setup
router.post("/create", checkAuth, createFamily);
router.post("/join", checkAuth, joinFamily);
router.get("/members", checkAuth, getMembers);
router.get("/me", checkAuth, getMyFamily);

// ✅ Family cart operations (were missing!)
router.get("/cart", checkAuth, getFamilyCart);
router.post("/add-qty", checkAuth, addQtyToFamilyCart);
router.post("/decrease-qty", checkAuth, decreaseQtyFromFamilyCart);
router.delete("/remove-cart", checkAuth, removeItemFromFamilyCart);

module.exports = router;
