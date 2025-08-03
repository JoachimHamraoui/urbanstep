"use client";

import { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import ProductCard from "./components/ProductCard";

interface Price {
  id: string;
  currency: string;
  unit_amount: number;
}

interface ProductCardProps {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  prices: Price[];
}

async function fetchProducts() {
  const res = await fetch("http://localhost:3000/api/products/get", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return data.products as ProductCardProps[];
}

export default function Home() {
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-neutral-800 font-sans">
          CTLG_
        </h1>
        {loading ? (
          <div className="text-center py-8">
            <p className="text-neutral-800">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.length === 0 ? (
              <div className="col-span-full text-center text-neutral-800">
                No products found.
              </div>
            ) : (
              products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
