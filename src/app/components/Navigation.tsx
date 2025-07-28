"use client";
import { useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { useCart } from "../context/CartContext";
import  CheckoutButton  from "./CheckoutButton";

export default function Navigation() {
  const [search, setSearch] = useState("");
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <nav className="w-full bg-neutral-800 border-b shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4 gap-4">
        <div className="text-2xl font-bold tracking-tight uppercase font-sans">
          UrbanStep_
        </div>
        <div className="flex-1 flex justify-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full max-w-md px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <CheckoutButton />
        <button className="relative p-2">
          <FaCartShopping />
          {itemCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
