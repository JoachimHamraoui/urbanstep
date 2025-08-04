import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(request: Request) {
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
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim() === "") {
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    // Fetch all products
    const products = await stripe.products.list({ active: true });

    // Fetch all prices
    const prices = await stripe.prices.list({ active: true });

    // Match each product with its price(s) and filter by search query
    const productsWithDetails = products.data
      .filter((product) => {
        const searchTerm = query.toLowerCase();
        const title = product.name?.toLowerCase() || "";
        const description = product.description?.toLowerCase() || "";

        return title.includes(searchTerm) || description.includes(searchTerm);
      })
      .map((product) => {
        const productPrices = prices.data.filter(
          (price) => price.product === product.id
        );
        return {
          id: product.id,
          title: product.name,
          description: product.description,
          image: product.images?.[0] || null,
          prices: productPrices.map((price) => ({
            id: price.id,
            currency: price.currency,
            unit_amount: price.unit_amount,
            recurring: price.recurring || null,
          })),
        };
      });

    return NextResponse.json(
      { products: productsWithDetails },
      { status: 200 }
    );
  } catch (error) {
    console.error("Search failed:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }
}
