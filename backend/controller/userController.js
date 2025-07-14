const asyncHandler = require("../middleware/asyncHandler");
const userModel = require("../model/userModel");
const cartModel = require("../model/cartModel");
const bcrypt = require("bcrypt");
const sendToken = require("../utils/jwt");
const { v4: uuidv4 } = require("uuid");

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(401).json({ success: false, message: "Invalid Credential" });
  } else {
    const isExist = await userModel.findOne({ email });
    if (!isExist) {
      res.status(401).json({ success: false, message: "Invalid Credential" });
    }
    const checkPassword = isExist.verifyPassword;
    if (checkPassword) {
      sendToken(isExist, res);
    } else {
      res.status(400).json({ success: false, message: "Invalid Credential" });
    }
  }
});

const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    res.status(401).json({ success: false, message: "Invalid credential" });
  }
  const isExist = await userModel.findOne({ email });
  if (!isExist) {
    const newUser = await userModel.create(req.body);
    sendToken(newUser, res);
  } else {
    res.status(400).json({ success: false, message: "Mail already exists" });
  }
});

const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "Logout successfully" });
});

const joinFamily = asyncHandler(async (req, res) => {
  const { userId } = req;
  const { familyCode } = req.body;

  if (!familyCode) {
    res.status(400);
    throw new Error("Family code is required");
  }

  const user = await userModel.findByIdAndUpdate(
    userId,
    { familyId: familyCode },
    { new: true }
  );

  // 🛠 Ensure family cart exists for joined users
  const existingCart = await cartModel.findOne({ familyId: familyCode });
  if (!existingCart) {
    await cartModel.create({ familyId: familyCode, cartItems: [] });
  }

  res.status(200).json({ message: "Joined family successfully", user });
});

const createFamily = asyncHandler(async (req, res) => {
  const { userId } = req;
  const familyCode = `FAM-${uuidv4().split("-")[0]}`;

  const user = await userModel.findByIdAndUpdate(
    userId,
    { familyId: familyCode },
    { new: true }
  );

  // create shared family cart if doesn't exist
  await cartModel.create({ familyId: familyCode, cartItems: [] });

  res.status(201).json({ message: "Family created", familyId: familyCode, user });
});

const leaveFamily = asyncHandler(async (req, res) => {
  const { userId } = req;
  const user = await userModel.findByIdAndUpdate(
    userId,
    { $unset: { familyId: "" } },
    { new: true }
  );

  res.status(200).json({ message: "Left family group", user });
});

const listFamilyMembers = asyncHandler(async (req, res) => {
  const { userId } = req;
  const user = await userModel.findById(userId);

  if (!user.familyId) {
    res.status(400);
    throw new Error("User is not part of any family group");
  }

  const members = await userModel.find({ familyId: user.familyId }).select("-password");
  res.status(200).json({ familyId: user.familyId, members });
});

const addCart = asyncHandler(async (req, res) => {
  const { userId } = req;
  const { product, type } = req.body;
  const id = product.id;

  const user = await userModel.findById(userId);
  const query = type === "family" && user.familyId ? { familyId: user.familyId } : { user: userId };

  let cart = await cartModel.findOne(query);

  if (cart) {
    const index = cart.cartItems.findIndex(item => item.product.id == id);
    if (index !== -1) {
      cart.cartItems[index].quantity += 1;
    } else {
      cart.cartItems.push({ product, addedBy: userId });
    }
    await cart.save();
  } else {
    cart = await cartModel.create({
      ...query,
      user: type === "family" ? undefined : userId,
      cartItems: [{ product, addedBy: userId }],
    });
  }

  res.status(200).json({ message: "Added to cart", total: cart.cartItems.length });
});

const removeCart = asyncHandler(async (req, res) => {
  const { userId } = req;
  const { id } = req.body;
  const { type } = req.query;

  const user = await userModel.findById(userId);
  const filter = type === "family" && user.familyId
    ? { familyId: user.familyId }
    : { user: userId };

  const cart = await cartModel.findOne(filter);
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const initialLength = cart.cartItems.length;
  cart.cartItems = cart.cartItems.filter(item => item.product.id != id);

  if (cart.cartItems.length === initialLength) {
    res.status(404);
    throw new Error("Item not found");
  }

  await cart.save();
  res.status(200).json({ message: "Item removed from cart", total: cart.cartItems.length });
});

const addCartQty = asyncHandler(async (req, res) => {
  const { userId } = req;
  const { productId } = req.body;
  const { type } = req.query;

  const user = await userModel.findById(userId);
  const filter = type === "family" && user.familyId ? { familyId: user.familyId } : { user: userId };

  const cart = await cartModel.findOne(filter);
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const item = cart.cartItems.find(ci => ci.product.id == productId);
  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  item.quantity += 1;
  await cart.save();

  res.status(200).json({ message: "Added qty" });
});

const decreaseCartQty = asyncHandler(async (req, res) => {
  const { userId } = req;
  const { productId } = req.body;
  const { type } = req.query;

  const user = await userModel.findById(userId);
  const filter = type === "family" && user.familyId ? { familyId: user.familyId } : { user: userId };

  const cart = await cartModel.findOne(filter);
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const item = cart.cartItems.find(ci => ci.product.id == productId);
  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  item.quantity = Math.max(1, item.quantity - 1);
  await cart.save();

  res.status(200).json({ message: "Decreased qty" });
});

const getUserCart = asyncHandler(async (req, res) => {
  const { userId } = req;
  const type = req.query.type;
  const user = await userModel.findById(userId);

  const query = type === "family" && user.familyId ? { familyId: user.familyId } : { user: userId };

  const cart = await cartModel
    .findOne(query)
    .populate("cartItems.addedBy", "name email");

  if (!cart) {
    res.status(404).json({ message: "Cart not found" });
  } else {
    res.status(200).json(cart);
  }
});

const getCartNumber = asyncHandler(async (req, res) => {
  const { userId } = req;
  const response = await cartModel.findOne({ user: userId });
  if (response) {
    res.status(200).json(response.cartItems.length);
  } else {
    res.status(200).json(0);
  }
});

module.exports = {
  login,
  register,
  logout,
  joinFamily,
  createFamily,
  leaveFamily,
  listFamilyMembers,
  addCart,
  removeCart,
  decreaseCartQty,
  addCartQty,
  getUserCart,
  getCartNumber,
};
