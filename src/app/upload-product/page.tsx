'use client'

import { useState } from 'react'

export default function UploadProductPage() {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!image) return alert("Upload an image!")

    setLoading(true)

    const formData = new FormData()
    formData.append("name", name)
    formData.append("price", price)
    formData.append("description", description)
    formData.append("image", image)

    console.table(formData);
    console.log(formData);

    const res = await fetch('/api/products/add', {
      method: 'POST',
      body: formData,
    })

    if (res.ok) {
      setSuccess(true)
      setName('')
      setPrice('')
      setDescription('')
      setImage(null)
    } else {
      alert('Error uploading product')
    }

    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Upload Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Price in EUR"
          value={price}
          required
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading ? "Uploading..." : "Submit"}
        </button>
        {success && <p className="text-green-600">✅ Product added successfully!</p>}
      </form>
    </div>
  )
}
