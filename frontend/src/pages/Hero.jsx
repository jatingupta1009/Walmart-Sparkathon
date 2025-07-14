import React, { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const Hero = () => {
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const { data } = await axios(
        "https://ecommerce-backend-new.vercel.app/api/products"
      );
      setProducts(data);
    } catch (error) {
      console.error("❌ Failed to fetch products", error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  // Split products for sections
  const trending = products.slice(0, 10);
  const electronics = products.filter(p => p.category === "electronics").slice(0, 8);
  const fashion = products.filter(p => p.category === "fashion").slice(0, 8);

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Banner */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 text-white py-12 px-4 md:px-10 mb-10 rounded-lg shadow-md">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
            Big Savings Await!
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Shop our top deals on electronics, fashion, and more
          </p>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-full transition">
            Shop Now
          </button>
        </div>

        {/* Shop by Category */}
        <div className="px-4 md:px-10 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Shop by Category
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {["Electronics", "Fashion", "Home", "Toys", "Grocery"].map((cat, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md cursor-pointer transition"
              >
                <span className="font-medium text-gray-700">{cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Products */}
        <div className="px-4 md:px-10 mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Trending Now 🔥
          </h2>
          <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {trending.map((item, idx) => (
              <ProductCard item={item} key={idx} />
            ))}
          </section>
        </div>

        {/* Electronics */}
        <div className="px-4 md:px-10 mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Top Electronics
          </h2>
          <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {electronics.length > 0 ? (
              electronics.map((item, idx) => (
                <ProductCard item={item} key={idx} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No electronics found
              </div>
            )}
          </section>
        </div>

        {/* Fashion */}
        <div className="px-4 md:px-10 mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Fashion Picks 👗
          </h2>
          <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {fashion.length > 0 ? (
              fashion.map((item, idx) => (
                <ProductCard item={item} key={idx} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No fashion products found
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Hero;
