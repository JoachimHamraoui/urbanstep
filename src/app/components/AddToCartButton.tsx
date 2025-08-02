"use client";

import { useCart } from "../context/CartContext";

interface Price {
  id: string;
  currency: string;
  unit_amount: number;
}

interface Product {
  id: string;
  title: string;
  priceId?: string;
  currency?: string;
  unit_amount?: number;
  image?: string | null;
}

interface AddToCartButtonProps {
  product: Product;
  price?: Price;
  className?: string;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}

export default function AddToCartButton({
  product,
  price,
  className = "w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition",
  children = "Add to cart",
  onClick,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    // Call the optional onClick handler first
    if (onClick) {
      onClick(e);
    }

    // Use the provided price or fall back to product's price data
    const targetPrice = price || {
      id: product.priceId || "",
      currency: product.currency || "",
      unit_amount: product.unit_amount || 0,
    };

    if (targetPrice.id && targetPrice.unit_amount) {
      addToCart({
        id: product.id,
        title: product.title,
        priceId: targetPrice.id,
        currency: targetPrice.currency,
        unit_amount: targetPrice.unit_amount,
        quantity: 1,
        image: product.image,
      });
    }
  };

  return (
    <button onClick={handleAddToCart} className={className}>
      {children}
    </button>
  );
}
