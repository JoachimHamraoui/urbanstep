import { headers } from "next/headers";
import ProductDetails from "../../components/ProductDetails";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  // Get host from headers
  const headersList = headers();
  const host = (await headersList).get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  // Build absolute URL
  const apiUrl = `${protocol}://${host}/api/products/${id}`;

  // Fetch product details
  const res = await fetch(apiUrl, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-2xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold mb-4 text-center text-neutral-800">
            Failed to load product
          </h1>
        </main>
      </div>
    );
  }

  const data = await res.json();
  const product = data?.product;

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-2xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold mb-4 text-center text-neutral-800">
            Product not found
          </h1>
        </main>
      </div>
    );
  }

  return <ProductDetails product={product} />;
}
