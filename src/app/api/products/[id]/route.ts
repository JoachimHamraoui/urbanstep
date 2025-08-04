import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Validate environment variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set");
}

const stripe = new Stripe(stripeSecretKey);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
    console.error(`Failed to fetch product ${params}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
