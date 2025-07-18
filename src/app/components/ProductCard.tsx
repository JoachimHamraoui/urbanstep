import Image from "next/image";
import Link from "next/link";

interface Price {
  id: string;
  currency: string;
  unit_amount: number;
}

interface ProductCardProps {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  prices: Price[];
}

export default function ProductCard({
  id,
  title,
  description,
  image,
  prices,
}: ProductCardProps) {
  // For simplicity, show the first price
  const price = prices[0];
  return (
    <Link href={`/product/${id}`} className="w-full max-w-xs">
      <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center hover:shadow-lg transition w-full max-w-xs">
        <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded mb-4 overflow-hidden relative">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="text-gray-400">No image</div>
          )}
        </div>
        <div className="w-full flex-1 flex flex-col">
          <h2
            className="font-semibold text-xl mb-1 truncate text-neutral-800 uppercase font-sans"
            title={title}
          >
            {title}
          </h2>
          <p className="text-gray-600 text-sm -mt-1 line-clamp-2">
            {description}
          </p>
          {price && (
            <div className="mt-auto font-bold text-base text-neutral-800">
              {price.unit_amount
                ? `${(price.unit_amount / 100).toFixed(
                    2
                  )} ${price.currency.toUpperCase()}`
                : "-"}
            </div>
          )}
        </div>
        <button
          id={id}
          className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Add to cart
        </button>
      </div>
    </Link>
  );
}
