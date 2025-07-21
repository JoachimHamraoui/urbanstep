"use client";
import { useState } from "react";
import { FaCartShopping } from "react-icons/fa6";

export default function Navigation() {
  const [search, setSearch] = useState("");
  return (
    <nav className="w-full bg-neutral-800 border-b shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4 gap-4">
        <div className="text-2xl font-bold tracking-tight uppercase font-sans">UrbanStep_</div>
        <div className="flex-1 flex justify-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full max-w-md px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <button className="relative p-2 rounded hover:text-red-500 hover:cursor-pointer transition duration-300 ease-in-out">
          <FaCartShopping />
        </button>
      </div>
    </nav>
  );
}
