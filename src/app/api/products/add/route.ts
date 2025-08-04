import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import cloudinary from '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'
import type { UploadApiResponse } from 'cloudinary'

export const runtime = 'nodejs'

// Validate environment variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set");
}

const stripe = new Stripe(stripeSecretKey);

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const name = formData.get('name') as string
    const price = parseFloat(formData.get('price') as string)
    const description = formData.get('description') as string
    const imageFile = formData.get('image') as File

    if (!name || !price || !imageFile) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // 1. Upload image to Cloudinary
    const buffer = Buffer.from(await imageFile.arrayBuffer())
    const uploadRes: UploadApiResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'urbanstep-products' }, (err, result) => {
          if (err || !result) return reject(err)
          resolve(result)
        })
        .end(buffer)
    })

    // 2. Create product on Stripe
    const stripeProduct = await stripe.products.create({
      name,
      description,
      images: [uploadRes.secure_url],
    })

    await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(price * 100),
      currency: 'eur',
    })

    // 3. Store product in PostgreSQL
    const dbProduct = await prisma.product.create({
      data: {
        name,
        price,
        image: uploadRes.secure_url,
        // optional: add stripeProductId to your schema and store it here
      },
    })

    return NextResponse.json({ success: true, product: dbProduct })
  } catch (err) {
    console.error('Error uploading product:', err)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
