import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create or update a test user (non-OAuth)
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
      password: "test", // In production, this should be hashed!
    },
  });

  // Create Products
  const product1 = await prisma.product.upsert({
    where: { id: "prod1" },
    update: {},
    create: {
      id: "prod1",
      name: "Urban Step Shoes",
      price: 99.99,
      image: "https://images.unsplash.com/photo-1517260911205-8a3b66e655a4?auto=format&fit=crop&w=400&q=80",
    },
  });

  const product2 = await prisma.product.upsert({
    where: { id: "prod2" },
    update: {},
    create: {
      id: "prod2",
      name: "Urban Step Backpack",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    },
  });

  // Create Address
  const address = await prisma.address.upsert({
    where: { id: "addr1" },
    update: {},
    create: {
      id: "addr1",
      userId: user.id,
      street: "123 Main St",
      city: "Urbanville",
      country: "Utopia",
    },
  });

  // Create Order with items
  const order = await prisma.order.upsert({
    where: { orderNumber: "ORDER-001" },
    update: {},
    create: {
      orderNumber: "ORDER-001",
      userId: user.id,
      addressId: address.id,
      items: {
        create: [
          { productId: product1.id, quantity: 2 },
          { productId: product2.id, quantity: 1 },
        ],
      },
    },
    include: { items: true },
  });

  console.log("User ready:", user);
  console.log("Seeded products:", product1, product2);
  console.log("Seeded address:", address);
  console.log("Seeded order:", order);
  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
