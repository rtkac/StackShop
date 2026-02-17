import type { ProductInsert } from "./schema";

const sampleProducts: ProductInsert[] = [
  {
    name: "Sample Product 1",
    description: "This is a sample product",
    price: "19.99",
    badge: "New",
    rating: "4.9",
    reviews: 234,
    image: "/tantack-circle-logo.png",
    inventory: "in-stock",
  },
  {
    name: "Sample Product 2",
    description: "This is another sample product",
    price: "129.99",
    badge: "New",
    rating: "4.9",
    reviews: 234,
    image: "/tantack-circle-logo.png",
    inventory: "in-stock",
  },
  {
    name: "Sample Product 3",
    description: "This is a sample product",
    price: "59.99",
    badge: "New",
    rating: "4.9",
    reviews: 234,
    image: "/tantack-circle-logo.png",
    inventory: "in-stock",
  },
  {
    name: "Sample Product 4",
    description: "This is a sample product",
    price: "99.99",
    badge: "New",
    rating: "4.9",
    reviews: 234,
    image: "/tantack-circle-logo.png",
    inventory: "in-stock",
  },
];

async function seed() {
  try {
    // Dynamically import database modules after environment variables are loaded
    const { db } = await import("./index");
    const { products } = await import("./schema");

    console.log("🌱 Starting database seed...");

    // Check if --reset flag is passed
    const shouldReset = process.argv.includes("--reset") || process.argv.includes("-r");

    if (shouldReset) {
      console.log("🗑️  Clearing existing products...");
      await db.delete(products);
      console.log("   Cleared all products");
    } else {
      // Check if products already exist
      const existingProducts = await db.select().from(products).limit(1);

      if (existingProducts.length > 0) {
        console.log("⚠️  Products already exist in the database.");
        console.log("   Run with --reset flag to clear and reseed: npm run db:seed -- --reset");
        process.exit(0);
      }
    }

    // Insert sample products
    console.log(`📦 Inserting ${sampleProducts.length} products...`);
    await db.insert(products).values(sampleProducts);

    console.log("✅ Database seeded successfully!");
    console.log(`   Inserted ${sampleProducts.length} products`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Only run seed() if this file is executed directly (not imported)
// This script should only run when executed via npm run db:seed
// It should NOT run when imported by other modules (like Vite during dev)
const isRunningAsScript = process.argv[1]?.includes("seed.ts") || process.argv[1]?.includes("tsx");

if (isRunningAsScript) {
  seed();
}
