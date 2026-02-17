import { eq } from "drizzle-orm";

import { db } from "@/db";
import { type ProductInsert, products } from "@/db/schema";

export async function getAllProducts() {
  try {
    const productsData = await db.select().from(products);
    return productsData;
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
}

export async function getRecommendedProducts() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const productsData = await db.select().from(products).limit(3);
    return productsData;
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    return [];
  }
}

export async function getProductById(id: string) {
  try {
    const product = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return product?.[0] ?? null;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    return null;
  }
}

export async function createProduct(data: ProductInsert) {
  try {
    const result = await db.insert(products).values(data).returning();
    const product = result[0];
    if (!product) {
      throw new Error("Failed to create product");
    }
    return product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}
