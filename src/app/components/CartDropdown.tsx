"use client";

import { useCart } from "../context/CartContext";
import { FaMinus, FaPlus } from "react-icons/fa";
import Image from "next/image";
import { apiClient } from "../../lib/api";

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDropdown({ isOpen }: CartDropdownProps) {
  const { cart, clearCart, updateQuantity } = useCart();

  const handleCheckout = async () => {
    try {
      const response = await apiClient.createCheckoutSession(cart);
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to create checkout session. Please try again.");
    }
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.unit_amount * item.quantity,
    0
  );

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-124 bg-white rounded-lg shadow-lg border z-50">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Shopping Cart</h3>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Clear
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="max-h-64 overflow-y-auto space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group"
                >
                  <div className="w-12 h-12 flex-shrink-0 bg-gray-200 rounded overflow-hidden relative">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
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
                      {item.title}
                    </h4>
                    <p className="text-gray-600 text-xs">
                      {(item.unit_amount / 100).toFixed(2)}{" "}
                      {item.currency.toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border rounded-lg bg-white">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition"
                        title="Decrease quantity"
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="px-3 py-1 text-sm font-medium text-gray-800 min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition"
                        title="Increase quantity"
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800 text-sm">
                      {((item.unit_amount * item.quantity) / 100).toFixed(2)}{" "}
                      {item.currency.toUpperCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-gray-800">Total:</span>
                <span className="font-bold text-lg text-gray-800">
                  {(totalAmount / 100).toFixed(2)}{" "}
                  {cart[0]?.currency.toUpperCase()}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold"
              >
                Go to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
