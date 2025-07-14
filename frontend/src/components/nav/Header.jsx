import React, { useEffect, useState } from "react";
import { HiShoppingCart, HiUserCircle } from "react-icons/hi";
import { NavLink, useNavigate } from "react-router-dom";
import UserMenu from "./UserMenu";
import { useAppStore } from "../../../store/appStore";
import API from "../../../utils/axios";
import { IoSearch } from "react-icons/io5";
import tesseractLogo from "../assets/tesseract.png";

const Header = () => {
  const { user, totalCart } = useAppStore();
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const getCartNumber = async () => {
    try {
      const { data } = await API("/api/user/get-user-cart-number");
      useAppStore.setState({ totalCart: data });
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    if (user) {
      getCartNumber();
    }
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${search}`);
      setSearch("");
    }
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="flex justify-between items-center px-4 md:px-10 py-3">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={tesseractLogo}
            alt="Logo"
            className="h-6 sm:h-8"
          />
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex-grow mx-4 hidden md:flex"
        >
          <div className="flex w-full max-w-3xl border border-gray-300 rounded-full overflow-hidden shadow-sm">
            <input
              type="text"
              placeholder="Search Walmart"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 focus:outline-none text-gray-700"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 flex items-center justify-center hover:bg-blue-700 transition"
            >
              <IoSearch size={20} />
            </button>
          </div>
        </form>

        {/* Icons */}
        <div className="flex items-center gap-4 relative">
          {/* Cart Icon */}
          <NavLink to="/cart" className="relative">
            <HiShoppingCart size={30} className="text-gray-700 hover:text-blue-600 transition" />
            {user && totalCart > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5">
                {totalCart}
              </span>
            )}
          </NavLink>

          {/* User Icon */}
          {user ? (
            <HiUserCircle
              size={30}
              className="text-gray-700 hover:text-blue-600 cursor-pointer transition"
              onClick={() => setShowMenu((prev) => !prev)}
            />
          ) : (
            <NavLink to="/login">
              <HiUserCircle
                size={30}
                className="text-gray-700 hover:text-blue-600 transition"
              />
            </NavLink>
          )}

          {/* User Menu */}
          {showMenu && <UserMenu setShowMenu={setShowMenu} />}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pb-3 md:hidden">
        <form
          onSubmit={handleSearch}
          className="flex w-full border border-gray-300 rounded-full overflow-hidden shadow-sm"
        >
          <input
            type="text"
            placeholder="Search Walmart"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 focus:outline-none text-gray-700"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 flex items-center justify-center hover:bg-blue-700 transition"
          >
            <IoSearch size={18} />
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;
