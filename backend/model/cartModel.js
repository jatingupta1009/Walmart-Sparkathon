const mongoose = require("mongoose");

const cartItemSchema = mongoose.Schema({
  product: {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    price: Number,
    description: { type: String, required: true },
    rating: { rate: { type: Number }, count: { type: Number } },
    category: { type: String, required: true },
    image: { type: String, required: true },
  },
  quantity: { type: Number, default: 1 },
  addedBy: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    familyId: {
      type: String, // or mongoose.Schema.Types.ObjectId if you use a Family model
    },
    cartItems: [cartItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.models.cart || mongoose.model("cart", cartSchema);
