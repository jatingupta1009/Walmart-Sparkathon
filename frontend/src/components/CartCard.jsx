import React from "react";
import { useNavigate } from "react-router-dom";
import { HiPlus, HiMinus } from "react-icons/hi";
import { useAppStore } from "../../store/appStore";

const CartCard = ({ item, isFamily }) => {
  const { removeCart, addCartQty, removeCartQty } = useAppStore();
  const navigate = useNavigate();

  const product = item?.product;
  const productId = product?.id || product?._id || "";
  const priceINR = Math.ceil((product?.price || 0) * 81);
  const productName = product?.title || "Unknown Product";
  const shortDescription = product?.description?.slice(0, 60) || "";

  const handleDecrease = () => {
    if (item.quantity === 1) {
      removeCart(productId, isFamily);
    } else {
      removeCartQty(productId, isFamily);
    }
  };

  return (
    <div className="rounded-2xl shadow-sm border border-slate-200 bg-white p-5 flex flex-col gap-4 hover:shadow-md transition">
      <div className="flex gap-5 items-start">
        {/* Product Image */}
        <div
          onClick={() => productId && navigate(`/product/${productId}`)}
          className="w-24 h-24 rounded-xl border cursor-pointer overflow-hidden bg-white"
        >
          <img
            src={product?.image || "/placeholder.jpg"}
            alt={productName}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between items-start">
            <div>
              <h2
                onClick={() => productId && navigate(`/product/${productId}`)}
                className="text-sm font-semibold text-slate-800 cursor-pointer hover:underline"
              >
                {productName}
              </h2>
              <p className="text-xs text-slate-500">
                {shortDescription}...
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-2 text-[11px]">
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  Sold & shipped by Walmart
                </span>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Free shipping ₹2800+
                </span>
                <span className="bg-yellow-400 text-white px-2 py-0.5 rounded-full">
                  Best seller
                </span>
              </div>

              <div className="text-[11px] text-slate-500 mt-1">
                Free 90-day returns · Gift eligible
              </div>
            </div>

            <div className="text-lg font-bold text-slate-900 min-w-[60px]">
              ₹{priceINR * item.quantity}
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecrease}
                className="px-3 py-1.5 rounded-full border text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 transition"
              >
                <HiMinus size={16} />
              </button>
              <span className="text-sm font-semibold">{item.quantity}</span>
              <button
                onClick={() => addCartQty(productId, isFamily)}
                className="px-3 py-1.5 rounded-full border text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 transition"
              >
                <HiPlus size={16} />
              </button>
            </div>

            <div className="flex gap-4 text-sm">
              <button className="text-blue-600 hover:underline">
                Save for later
              </button>
              <button
                onClick={() => removeCart(productId, isFamily)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
