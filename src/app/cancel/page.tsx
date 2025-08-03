import Link from "next/link";
export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-center">
      <h1 className="text-3xl font-bold text-red-600">❌ Payment Canceled</h1>
      <p className="text-gray-600 mt-4">Your order was not completed.</p>
      <Link
        href="/"
        className="mt-6 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        Back to Home
      </Link>
    </div>
  );
}
