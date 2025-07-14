"use client";
import { useState } from "react";

export default function Navigation() {
  const [search, setSearch] = useState("");
  return (
    <nav className="w-full bg-white border-b shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4 gap-4">
        <div className="text-2xl font-bold tracking-tight">UrbanStep</div>
        <div className="flex-1 flex justify-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full max-w-md px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <button className="relative p-2 rounded hover:bg-gray-100 transition">
          {/* Placeholder cart icon */}
          <svg
            width="28"
            height="28"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path
              d="M1 1h2l.4 2M7 13h10l4-8H5.4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}
