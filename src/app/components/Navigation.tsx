"use client";
import { useState, useRef, useEffect } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { useCart } from "../context/CartContext";
import CartDropdown from "./CartDropdown";
import SearchDropdown from "./SearchDropdown";

interface NavigationProps {
  initialSearch?: string;
}

export default function Navigation({ initialSearch }: NavigationProps) {
  const [search, setSearch] = useState(initialSearch || "");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Set initial search value from URL
  useEffect(() => {
    if (typeof window !== "undefined" && !initialSearch) {
      const urlParams = new URLSearchParams(window.location.search);
      const urlSearch = urlParams.get("search") || "";
      setSearch(urlSearch);
    }
  }, [initialSearch]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsCartOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsCartOpen(false);
    }, 150); // 150ms delay before closing
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setIsSearchDropdownOpen(true);
  };

  // Handle search input focus
  const handleSearchFocus = () => {
    if (search.trim()) {
      setIsSearchDropdownOpen(true);
    }
  };

  // Handle search input blur
  const handleSearchBlur = () => {
    // Delay closing to allow clicking on dropdown items
    setTimeout(() => {
      setIsSearchDropdownOpen(false);
    }, 200);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className="w-full bg-neutral-800 border-b shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4 gap-4">
        <div className="text-2xl font-bold tracking-tight uppercase font-sans">
          UrbanStep_
        </div>
        <div className="text-sm text-red-400 font-bold uppercase">
          DEMO - ONLY USE STRIPE TEST CARD
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-md" ref={searchRef}>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              placeholder="Search products..."
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
            <SearchDropdown
              isOpen={isSearchDropdownOpen}
              searchQuery={search}
              onClose={() => setIsSearchDropdownOpen(false)}
            />
          </div>
        </div>
        <div
          className="relative"
          ref={cartRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button className="relative p-2 text-white hover:text-gray-300 transition">
            <FaCartShopping />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
          <CartDropdown
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
          />
        </div>
      </div>
    </nav>
  );
}
