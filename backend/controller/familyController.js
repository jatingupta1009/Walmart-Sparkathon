const Family = require("../model/familyModel");
const User = require("../model/userModel");
const Cart = require("../model/cartModel");

let nanoid;
(async () => {
  const nanoidModule = await import("nanoid");
  nanoid = nanoidModule.nanoid;
})();

// --- FAMILY SETUP HANDLERS ---

const createFamily = async (req, res) => {
  try {
    const { userId } = req;
    const code = nanoid(6); // Now nanoid is initialized properly
    const family = await Family.create({ code, members: [userId] });

    await User.findByIdAndUpdate(userId, { $push: { familyGroup: family._id } });

    res.status(200).json({ message: "Family created", code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const joinFamily = async (req, res) => {
  const { code } = req.body;
  const { userId } = req;

  try {
    const family = await Family.findOne({ code });
    if (!family) return res.status(404).json({ message: "Invalid code" });

    if (!family.members.includes(userId)) {
      family.members.push(userId);
      await family.save();
      await User.findByIdAndUpdate(userId, { $push: { familyGroup: family._id } });
    }

    res.status(200).json({ message: "Joined family" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMembers = async (req, res) => {
  const { userId } = req;

  try {
    const user = await User.findById(userId).populate("familyGroup");

    if (!user.familyGroup.length) {
      return res.status(400).json({ message: "No family group found" });
    }

    const families = await Family.find({ _id: { $in: user.familyGroup } }).populate("members", "name email");

    res.status(200).json({ families });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMyFamily = async (req, res) => {
  const { userId } = req;

  try {
    const family = await Family.findOne({ members: userId }).populate("members", "name email");

    if (!family) {
      return res.status(404).json({ message: "No family found" });
    }

    res.status(200).json(family);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getFamilyCart = async (req, res) => {
  const { userId } = req;

  try {
    const family = await Family.findOne({ members: userId });

    if (!family) {
      return res.status(404).json({ message: "No family found" });
    }

    const familyCart = await Cart.find({ user: { $in: family.members } }).populate("cartItems.addedBy", "name");

    const mergedItems = familyCart.flatMap(cart =>
      cart.cartItems.map(item => ({
        ...item.toObject(),
        user: cart.user
      }))
    );

    res.status(200).json({ cartItems: mergedItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const addQtyToFamilyCart = async (req, res) => {
  const { productId } = req.body;
  const { userId } = req;

  try {
    const family = await Family.findOne({ members: userId });
    const carts = await Cart.find({ user: { $in: family.members } });

    for (let cart of carts) {
      const item = cart.cartItems.find(ci => ci.product.id == productId);
      if (item) {
        item.quantity += 1;
        await cart.save();
        return res.status(200).json({ message: "Quantity increased" });
      }
    }

    return res.status(404).json({ message: "Item not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const decreaseQtyFromFamilyCart = async (req, res) => {
  const { productId } = req.body;
  const { userId } = req;

  try {
    const family = await Family.findOne({ members: userId });
    const carts = await Cart.find({ user: { $in: family.members } });

    for (let cart of carts) {
      const item = cart.cartItems.find(ci => ci.product.id == productId);
      if (item) {
        item.quantity = Math.max(1, item.quantity - 1);
        await cart.save();
        return res.status(200).json({ message: "Quantity decreased" });
      }
    }

    return res.status(404).json({ message: "Item not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const removeItemFromFamilyCart = async (req, res) => {
  const { id: productId } = req.body;
  const { userId } = req;

  try {
    const family = await Family.findOne({ members: userId });
    const carts = await Cart.find({ user: { $in: family.members } });

    for (let cart of carts) {
      const initialLength = cart.cartItems.length;
      cart.cartItems = cart.cartItems.filter(ci => ci.product.id != productId);
      if (cart.cartItems.length !== initialLength) {
        await cart.save();
        return res.status(200).json({ message: "Item removed" });
      }
    }

    return res.status(404).json({ message: "Item not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createFamily,
  joinFamily,
  getMembers,
  getMyFamily,
  getFamilyCart,
  addQtyToFamilyCart,
  decreaseQtyFromFamilyCart,
  removeItemFromFamilyCart
};
