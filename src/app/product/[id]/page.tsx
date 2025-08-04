import ProductDetails from "../../components/ProductDetails";
import { apiClient } from "../../../lib/api";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await apiClient.getProduct(params.id);

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
