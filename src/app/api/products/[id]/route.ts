import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;

    // Fetch the product by ID
    const product = await stripe.products.retrieve(id);

    // Fetch all prices for this product
    const prices = await stripe.prices.list({ product: id, active: true });

    const productWithDetails = {
      id: product.id,
      title: product.name,
      description: product.description,
      image: product.images?.[0] || null,
      prices: prices.data.map((price) => ({
        id: price.id,
        currency: price.currency,
        unit_amount: price.unit_amount,
        recurring: price.recurring || null,
      })),
    };

    return NextResponse.json({ product: productWithDetails }, { status: 200 });
  } catch (error) {
    console.error(`Failed to fetch product:`, error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
