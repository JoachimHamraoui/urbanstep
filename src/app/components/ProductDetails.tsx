"use client";

import Image from "next/image";
import Navigation from "./Navigation";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import AddToCartButton from "./AddToCartButton";

interface Price {
  id: string;
  currency: string;
  unit_amount: number;
}

interface Product {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  prices: Price[];
}

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const price = product.prices[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <Link href={`/`}>
          <p className="text-2xl pl-5 font-bold text-neutral-800">
            <FaArrowLeft />
          </p>
        </Link>
        <div className="bg-white rounded-lg shadow p-6 flex flex-row">
          <div className="w-1/2 h-124 flex items-center justify-center bg-gray-100 rounded mb-6 overflow-hidden relative">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.title}
                fill
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div className="text-gray-400">No image</div>
            )}
          </div>
          <div className="w-full flex-1 flex flex-col justify-start ml-4 mt-4">
            <h1 className="font-bold text-2xl mb-2 text-neutral-800 uppercase font-sans">
              {product.title}
            </h1>
            <p className="text-gray-600 text-base mb-4">
              {product.description}
            </p>
            {price && (
              <div className="font-bold text-lg text-neutral-800 mb-4">
                {price.unit_amount
                  ? `${(price.unit_amount / 100).toFixed(
                      2
                    )} ${price.currency.toUpperCase()}`
                  : "-"}
              </div>
            )}
            <AddToCartButton
              product={product}
              price={price}
              className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition font-semibold"
            >
              Add to cart
            </AddToCartButton>
          </div>
        </div>
      </main>
    </div>
  );
}
