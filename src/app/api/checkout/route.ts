import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { CartItem } from "@/app/context/CartContext";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { cart } = await req.json();

  const line_items = cart.map((item: CartItem) => ({
    price: item.priceId,
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
  });

  return NextResponse.json({ url: session.url });
}
