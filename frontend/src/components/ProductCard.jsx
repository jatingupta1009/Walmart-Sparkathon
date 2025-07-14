import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/appStore";

const ProductCard = ({ item }) => {
  const { addCart } = useAppStore();
  const navigate = useNavigate();

  const productName = (name) =>
    name.length > 40 ? name.substring(0, 40) + "..." : name;

  return (
    <div
      className="flex flex-col bg-white rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer relative"
    >
      {/* Product Image */}
      <div
        className="w-full h-[180px] md:h-[220px] bg-gray-100 rounded-t-lg overflow-hidden"
        onClick={() => navigate(`/product/${item.id}`)}
      >
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-200"
        />
      </div>

      {/* Product Info */}
      <div className="p-3 flex flex-col flex-grow justify-between">
        {/* Title */}
        <h2
          className="text-sm font-medium text-gray-800 mb-1 hover:text-blue-600"
          onClick={() => navigate(`/product/${item.id}`)}
        >
          {productName(item.title)}
        </h2>

        {/* Price */}
        <p className="text-lg font-bold text-gray-900">
          ₹ {Math.ceil(item.price * 81)}
        </p>
      </div>

      {/* Add to Cart Button */}
      <div className="p-3">
        <button
          onClick={() => addCart(item, navigate)}
          className="w-full bg-blue-600 text-white text-sm py-2 rounded-full hover:bg-blue-700 transition font-semibold"
        >
          Add to Cart
        </button>
      </div>

      {/* Rating Badge */}
      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full shadow">
        ⭐ {item.rating.rate} ({item.rating.count})
      </div>
    </div>
  );
};

export default ProductCard;
