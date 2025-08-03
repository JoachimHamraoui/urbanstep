import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const { id } = params;

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
}
