import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { CartItem } from "@/app/context/CartContext";

export async function POST(req: NextRequest) {
  try {
    // Validate environment variables at runtime
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Stripe configuration is missing" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);
    const { cart } = await req.json();

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: "Invalid cart data" }, { status: 400 });
    }

    const line_items = cart.map((item: CartItem) => ({
      price: item.priceId,
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/success`,
      cancel_url: `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
