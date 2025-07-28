"use client";
import { useCart } from "../context/CartContext";

export default function CheckoutButton() {
  const { cart } = useCart();

  const handleCheckout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart }),
    });

    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  return (
    <button
      onClick={handleCheckout}
      className="bg-black text-white px-6 py-3 rounded mt-4"
    >
      Proceed to Checkout
    </button>
  );
}
