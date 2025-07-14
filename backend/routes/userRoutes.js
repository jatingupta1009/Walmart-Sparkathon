const express = require("express");
const {
  login,
  register,
  logout,
  addCart,
  removeCart,
  decreaseCartQty,
  addCartQty,
  getUserCart,
  getCartNumber,
  joinFamily,
  createFamily,
  leaveFamily,
  listFamilyMembers,
} = require("../controller/userController");
const checkAuth = require("../middleware/checkAuth");

const userRoutes = express.Router();

// Auth
userRoutes.post("/login", login);
userRoutes.post("/register", register);
userRoutes.post("/logout", checkAuth, logout);

// Cart
userRoutes.get("/get-user-cart-number", checkAuth, getCartNumber);
userRoutes.get("/get-user-cart", checkAuth, getUserCart);
userRoutes.post("/add-cart", checkAuth, addCart);
userRoutes.delete("/remove-cart", checkAuth, removeCart);
userRoutes.post("/add-qty", checkAuth, addCartQty);
userRoutes.post("/decrease-qty", checkAuth, decreaseCartQty);

// Family Cart Features
userRoutes.post("/join-family", checkAuth, joinFamily);
userRoutes.post("/create-family", checkAuth, createFamily);
userRoutes.post("/leave-family", checkAuth, leaveFamily);
userRoutes.get("/family-members", checkAuth, listFamilyMembers);

module.exports = userRoutes;
