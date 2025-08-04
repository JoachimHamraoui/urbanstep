"use client";

import { useState } from "react";
import { apiClient } from "../../lib/api";

export default function UploadProductPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!image) {
      setError("Please upload an image!");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("image", image);

    try {
      const response = await apiClient.uploadProduct(formData);

      if (response.success) {
        setSuccess(true);
        setName("");
        setPrice("");
        setDescription("");
        setImage(null);
      } else {
        setError(response.error || "Error uploading product");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setError("Error uploading product. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Upload Product</h1>

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Product uploaded successfully!
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Price</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload Product"}
        </button>
      </form>
    </div>
  );
}
