import { desc, eq, gt } from "drizzle-orm";

import { db } from "@/db";
import { cartItems, products } from "@/db/schema";

export const getCartItemsCount = async () => {
  const cart = await getCartItems();
  const count = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  return {
    count,
    total: cart.items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0),
  };
};

export const getCartItems = async () => {
  const cart = await db
    .select()
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .orderBy(desc(cartItems.createdAt));

  return {
    items: cart.map((item) => ({
      ...item.products,
      quantity: item.cart_items.quantity,
    })),
  };
};

export async function removeFromCart(productId: string) {
  await db.delete(cartItems).where(eq(cartItems.productId, productId));
  return await getCartItems();
}

export async function clearCart() {
  await db.delete(cartItems).where(gt(cartItems.quantity, 0));
  return await getCartItems();
}

export async function updateCartItem(productId: string, quantity: number = 1) {
  const qty = Math.max(0, Math.min(quantity, 99));

  if (qty === 0) {
    await db.delete(cartItems).where(eq(cartItems.productId, productId));
  }

  const existingItem = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.productId, productId))
    .limit(1);

  if (existingItem.length > 0) {
    await db.update(cartItems).set({ quantity: qty }).where(eq(cartItems.productId, productId));
  }
}

export async function addToCart(productId: string, quantity: number = 1) {
  const qty = Math.max(1, Math.min(quantity, 99));

  const existingItem = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.productId, productId))
    .limit(1);

  if (existingItem.length > 0) {
    await updateCartItem(productId, existingItem[0].quantity + qty);
  } else {
    await db.insert(cartItems).values({ productId, quantity: qty });
  }

  return await getCartItems();
}
