"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiClient, Product } from "../../lib/api";

interface SearchDropdownProps {
  isOpen: boolean;
  searchQuery: string;
  onClose: () => void;
}

export default function SearchDropdown({
  isOpen,
  searchQuery,
  onClose,
}: SearchDropdownProps) {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !searchQuery.trim()) {
      setResults([]);
      return;
    }

    const searchProducts = async () => {
      setLoading(true);
      try {
        const products = await apiClient.searchProducts(searchQuery);
        setResults(products);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, isOpen]);

  if (!isOpen || !searchQuery.trim()) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border z-50 max-h-96 overflow-y-auto">
      {loading ? (
        <div className="p-4 text-center text-gray-500">Searching...</div>
      ) : results.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No products found</div>
      ) : (
        <div className="py-2">
          {results.slice(0, 8).map((product) => {
            const price = product.prices[0];
            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                onClick={onClose}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 flex-shrink-0 bg-gray-200 rounded overflow-hidden relative">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No img
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 text-sm truncate">
                    {product.title}
                  </h4>
                  <p className="text-gray-600 text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                    {product.description}
                  </p>
                  {price && (
                    <p className="text-gray-600 text-xs mt-1">
                      {(price.unit_amount / 100).toFixed(2)}{" "}
                      {price.currency.toUpperCase()}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
          {results.length > 8 && (
            <div className="px-3 py-2 text-center text-sm text-gray-500 border-t">
              {results.length - 8} more results...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
