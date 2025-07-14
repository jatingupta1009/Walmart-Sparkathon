import React, { useEffect, useState } from "react";
import Layout from "./../layout/Layout";
import CartCard from "../components/CartCard";
import { useAppStore } from "../../store/appStore";
import { useNavigate } from "react-router-dom";
import { PiSmileySadFill } from "react-icons/pi";
import { Switch } from "@headlessui/react";
import FamilyModal from "../components/FamilyModal";
import API from "../../utils/axios";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, getUserCart, getFamilyCart, user } = useAppStore();
  const [isFamily, setIsFamily] = useState(false);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [family, setFamily] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      if (isFamily) {
        getFamilyCart();
        API.get("/api/family/me")
          .then((res) => setFamily(res.data))
          .catch((err) => console.error("❌ Failed to fetch family info", err));
      } else {
        getUserCart();
        setFamily(null);
      }
    }
  }, [user, isFamily]);

  const handleCopy = () => {
    if (family?.code) {
      const inviteLink = `${window.location.origin}/join-family/${family.code}`;
      navigator.clipboard.writeText(inviteLink);
      alert("Invite link copied!");
    }
  };

  const groupedCart = {};
  const displayNameMap = {};

  cart?.forEach((item) => {
    const rawName = isFamily ? item?.addedBy?.name || "Unknown" : "You";
    const normalized = rawName.trim().toLowerCase();
    if (!groupedCart[normalized]) {
      groupedCart[normalized] = [];
      displayNameMap[normalized] = rawName.trim();
    }
    groupedCart[normalized].push(item);
  });

  const displayCart = Object.entries(groupedCart).map(([key, items], idx) => (
    <div key={idx} className="mb-6 rounded-lg bg-white shadow border border-gray-200">
      {isFamily && (
        <div className="bg-gray-50 px-6 py-3 rounded-t-lg border-b">
          <h3 className="text-sm font-medium text-gray-700">
            Added by: <span className="text-blue-600 font-semibold">{displayNameMap[key]}</span>
          </h3>
        </div>
      )}
      <div className="p-4 flex flex-col gap-4">
        {items.map((item, i) => (
          <CartCard key={i} item={item} isFamily={isFamily} />
        ))}
      </div>
    </div>
  ));

  let subtotal = Math.ceil(
    cart?.reduce((acc, item) => acc + item.product.price * item.quantity, 0) * 81
  );

  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-8 min-h-screen w-full px-4 md:px-8 py-8 bg-gray-50">
        {/* LEFT SIDE: CART ITEMS */}
        <div className="w-full md:w-2/3">
          {isFamily && family && (
  <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-md">
    {/* Title */}
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        👨‍👩‍👧‍👦 Family Group
        <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
          Active
        </span>
      </h2>
      <button
        onClick={handleCopy}
        className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition"
      >
        Copy Invite Link
      </button>
    </div>

    {/* Family Code */}
    <div className="mb-3">
      <span className="text-sm text-gray-500">Family Code:</span>
      <div className="mt-1 inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-mono">
        {family.code}
      </div>
    </div>

    {/* Members List */}
    <div>
      <h3 className="text-sm text-gray-600 font-medium mb-2">Members:</h3>
      <ul className="flex flex-wrap gap-2">
        {family.members.map((m, i) => (
          <li
            key={i}
            className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border text-gray-700 text-sm"
          >
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
              {m.name.charAt(0).toUpperCase()}
            </div>
            {m.name}
          </li>
        ))}
      </ul>
    </div>
  </div>
)}


          {/* CART HEADER */}
          <div className="flex justify-between items-center mb-5 p-4 bg-white shadow rounded-lg">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
  {isFamily ? "Family Cart" : "Your Cart"}
</h2>

              <h3 className="text-sm text-gray-500">
                Total Items: {cart?.length}
              </h3>
            </div>
            <div className="flex flex-col items-end gap-2">
              {/* FAMILY CART SWITCH */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Use Family Cart</span>
                <Switch
                  checked={isFamily}
                  onChange={setIsFamily}
                  className={`${isFamily ? "bg-blue-600" : "bg-gray-300"} relative inline-flex h-6 w-11 items-center rounded-full transition`}
                >
                  <span
                    className={`${isFamily ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition`}
                  />
                </Switch>
              </div>
              {/* PILL BUTTON */}
              <button
                onClick={() => setShowFamilyModal(true)}
                className="text-xs px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
              >
                Join / Create Family
              </button>
            </div>
          </div>

          {/* CART CONTENT */}
          {cart?.length ? (
            <div>{displayCart}</div>
          ) : (
            <div className="flex flex-col justify-center items-center mt-10">
              <PiSmileySadFill size={50} color="#9CA3AF" />
              <p className="text-lg font-semibold text-gray-700 mt-3">Your cart is empty</p>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: ORDER SUMMARY */}
       {cart?.length ? (
  <div className="w-full md:w-1/3">
    <div className="bg-white border border-gray-200 shadow rounded-lg overflow-hidden">
      <div className="bg-gray-100 p-5 border-b">
        <h2 className="text-lg font-bold text-gray-800">Order Summary</h2>
        <p className="text-sm text-gray-600">Free delivery on orders over ₹500</p>
      </div>
      <div className="p-5 flex flex-col gap-4 text-sm text-gray-700">
        {isFamily ? (
          // Group items by user
          Object.entries(groupedCart).map(([key, items], idx) => (
            <div key={idx} className="mb-3">
              <h3 className="text-blue-600 font-medium mb-1">
                Added by: {displayNameMap[key]}
              </h3>
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-gray-700 text-sm"
                >
                  <span>
                    {item.quantity} ×{" "}
                    {item.product.title.length > 20
                      ? item.product.title.slice(0, 20) + "..."
                      : item.product.title}
                  </span>
                  <span>
                    ₹{" "}
                    {Math.ceil(item.quantity * item.product.price * 81)}
                  </span>
                </div>
              ))}
            </div>
          ))
        ) : (
          // Flat list if not family mode
          cart.map((item, index) => (
            <div
              key={index}
              className="flex justify-between text-gray-700 text-sm"
            >
              <span>
                {item.quantity} ×{" "}
                {item.product.title.length > 20
                  ? item.product.title.slice(0, 20) + "..."
                  : item.product.title}
              </span>
              <span>
                ₹ {Math.ceil(item.quantity * item.product.price * 81)}
              </span>
            </div>
          ))
        )}

        {/* Total */}
        <div className="border-t pt-3 flex justify-between text-base font-bold">
          <span>Total</span>
          <span>₹ {subtotal - 40}</span>
        </div>
      </div>
      <div className="px-5 pb-5">
        <button className="w-full mt-4 bg-blue-600 text-white py-2.5 rounded-full hover:bg-blue-700 transition text-sm font-semibold">
          Proceed to Checkout
        </button>
      </div>
    </div>
  </div>
) : null}

      </div>

      {/* FAMILY MODAL */}
      <FamilyModal isOpen={showFamilyModal} setIsOpen={setShowFamilyModal} />
    </Layout>
  );
};

export default Cart;
