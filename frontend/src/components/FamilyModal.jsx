import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useAppStore } from "../../store/appStore"; // adjust path if needed
import { toast } from "react-toastify";
import API from "../../utils/axios";

const FamilyModal = ({ isOpen, setIsOpen }) => {
  const [tab, setTab] = useState("join"); // 'join' or 'create'
  const [code, setCode] = useState("");
  const { getUserCart, getFamilyCart, setUseFamilyCart } = useAppStore();

  const joinFamily = async () => {
    try {
      const res = await API.post("/api/family/join", { code });
      toast.success(res.data.message);
      await getFamilyCart();
      setUseFamilyCart(true);
      setIsOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error joining family");
    }
  };

  const createFamily = async () => {
    try {
      const res = await API.post("/api/family/create");
      toast.success(`Family created. Code: ${res.data.code}`);
      getFamilyCart();
      setIsOpen(false);
    } catch (err) {
      toast.error("Failed to create family");
    }
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" aria-hidden="true" />

      {/* Modal content */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl shadow-lg bg-white p-6 space-y-5">
          {/* Title */}
          <Dialog.Title className="text-xl font-bold text-gray-800 text-center">
            👨‍👩‍👧‍👦 Family Cart
          </Dialog.Title>

          {/* Toggle Join/Create */}
          <div className="flex justify-center gap-2">
            <button
              className={`px-5 py-2 rounded-full font-medium transition-colors duration-200 ${
                tab === "join"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setTab("join")}
            >
              Join Family
            </button>
            <button
              className={`px-5 py-2 rounded-full font-medium transition-colors duration-200 ${
                tab === "create"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setTab("create")}
            >
              Create Family
            </button>
          </div>

          {/* Join Family Form */}
          {tab === "join" && (
            <div className="space-y-4">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter Family Code"
                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <button
                onClick={joinFamily}
                className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition font-semibold"
              >
                Join Family
              </button>
            </div>
          )}

          {/* Create Family Button */}
          {tab === "create" && (
            <div>
              <button
                onClick={createFamily}
                className="w-full bg-green-600 text-white py-2 rounded-full hover:bg-green-700 transition font-semibold"
              >
                Create Family
              </button>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-sm underline"
            >
              Cancel
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default FamilyModal;
