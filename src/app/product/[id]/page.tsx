import ProductDetails from "../../components/ProductDetails";

interface Price {
  id: string;
  currency: string;
  unit_amount: number;
}

interface Product {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  prices: Price[];
}

async function fetchProduct(id: string): Promise<Product | null> {
  const res = await fetch(`http://localhost:3000/api/products/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.product as Product;
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await fetchProduct(params.id);

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
