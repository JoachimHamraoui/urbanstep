import Image from "next/image";

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
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center hover:shadow-lg transition w-full max-w-xs">
      <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded mb-4 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={title}
            width={200}
            height={192}
            style={{ objectFit: "contain", height: "100%", width: "auto" }}
          />
        ) : (
          <div className="text-gray-400">No image</div>
        )}
      </div>
      <div className="w-full flex-1 flex flex-col">
        <h2 className="font-semibold text-lg mb-1 truncate" title={title}>
          {title}
        </h2>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
        {price && (
          <div className="mt-auto font-bold text-base">
            {price.unit_amount
              ? `${(price.unit_amount / 100).toFixed(
                  2
                )} ${price.currency.toUpperCase()}`
              : "-"}
          </div>
        )}
      </div>
      <button id={id} className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
        Add to cart
      </button>
    </div>
  );
}
