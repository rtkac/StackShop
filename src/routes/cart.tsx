import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Minus, Plus } from "lucide-react";

import { CartFooter } from "@/components/cart/CartFooter";
import { EmptyCartState } from "@/components/cart/EmptyCartState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MutateCartFnInput } from "@/types/cart";

const fetchCartItems = createServerFn({ method: "GET" }).handler(async () => {
  const { getCartItems } = await import("@/data/cart");
  const data = await getCartItems();
  return data;
});

export const mutateCartFn = createServerFn({ method: "POST" })
  .inputValidator((data: MutateCartFnInput) => data)
  .handler(async ({ data }) => {
    const { addToCart, updateCartItem, removeFromCart, clearCart } = await import("@/data/cart");
    switch (data.action) {
      case "add":
        return await addToCart(data.productId, data.quantity);
      case "remove":
        return await removeFromCart(data.productId);
      case "update":
        return await updateCartItem(data.productId, data.quantity);
      case "clear":
        return await clearCart();
    }
  });

export const Route = createFileRoute("/cart")({
  component: CartPage,
  loader: async () => {
    return fetchCartItems();
  },
});

function CartPage() {
  const queryClient = useQueryClient();
  const cart = Route.useLoaderData();
  const router = useRouter();
  const shipping = cart.items.length > 0 ? 8 : 0;
  const subtotal = cart.items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);
  const total = subtotal + shipping;

  if (cart.items.length === 0) {
    return <EmptyCartState />;
  }

  const handleClearCart = async () => {
    await mutateCartFn({
      data: {
        action: "clear",
      },
    });
    await router.invalidate({ sync: true });
    await queryClient.invalidateQueries({ queryKey: ["cart-items-data"] });
  };

  const handleDecreaseQuantity = async (productId: string, quantity: number) => {
    await mutateCartFn({
      data: {
        action: "update",
        productId,
        quantity: quantity - 1,
      },
    });
    await router.invalidate({ sync: true });
    await queryClient.invalidateQueries({ queryKey: ["cart-items-data"] });
  };

  const handleIncreaseQuantity = async (productId: string) => {
    await mutateCartFn({
      data: {
        action: "add",
        productId,
        quantity: 1,
      },
    });
    await router.invalidate({ sync: true });
    await queryClient.invalidateQueries({ queryKey: ["cart-items-data"] });
  };

  const handleRemoveFromCart = async (productId: string) => {
    await mutateCartFn({
      data: {
        action: "remove",
        productId,
        quantity: 0,
      },
    });
    await router.invalidate({ sync: true });
    await queryClient.invalidateQueries({ queryKey: ["cart-items-data"] });
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-6 rounded-2xl border bg-white/80 p-6 shadow-sm lg:grid-cols-[2fr,1fr] dark:border-slate-800 dark:bg-slate-900/80">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-2xl">Cart</h1>
            <p className="text-slate-600 text-sm dark:text-slate-300">
              Review your picks before checking out.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClearCart}>
            Clear cart
          </Button>
        </div>

        <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-xs dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-950/40">
          {cart.items.map((item) => (
            <div key={item.id} className="grid gap-4 p-4 sm:grid-cols-[auto,1fr,auto]">
              <div className="hidden h-20 w-20 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 sm:flex dark:border-slate-800 dark:bg-slate-900">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-12 w-12 object-contain"
                  loading="lazy"
                />
              </div>
              <div className="space-y-1">
                <Link
                  to="/products/$id"
                  params={{ id: item.id }}
                  className="font-semibold text-base hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {item.name}
                </Link>
                <div className="flex items-center gap-3 font-semibold text-sm">
                  <span>${Number(item.price).toFixed(2)}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600 dark:text-slate-300">
                    {item.inventory === "in-stock"
                      ? "In stock"
                      : item.inventory === "backorder"
                        ? "Backorder"
                        : "Preorder"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 sm:items-center sm:justify-between sm:gap-2 sm:text-right">
                <div className="flex items-center gap-2">
                  <Button
                    size="icon-sm"
                    variant="outline"
                    aria-label={`Decrease ${item.name}`}
                    onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                  >
                    <Minus size={14} />
                  </Button>
                  <Input
                    type="number"
                    min={1}
                    max={99}
                    value={item.quantity}
                    onChange={(_event) => {}}
                    className="h-9 w-14 rounded-md border border-slate-200 bg-white text-center font-semibold text-sm shadow-xs dark:border-slate-800 dark:bg-slate-900"
                  />
                  <Button
                    size="icon-sm"
                    variant="outline"
                    aria-label={`Increase ${item.name}`}
                    onClick={() => handleIncreaseQuantity(item.id)}
                  >
                    <Plus size={14} />
                  </Button>
                </div>
                <div className="font-semibold text-sm">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-slate-500 hover:text-red-500"
                  onClick={() => handleRemoveFromCart(item.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CartFooter subtotal={subtotal} shipping={shipping} total={total} />
    </div>
  );
}
