import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { ShoppingBagIcon } from "lucide-react";

import { Button } from "./ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

import type { ProductSelect } from "@/db/schema";
import { cn } from "@/lib/utils";
import { mutateCartFn } from "@/routes/cart";

const inventoryTone = {
  "in-stock": "bg-green-100 text-green-800 border-green-200",
  backordered: "bg-yellow-100 text-yellow-800 border-yellow-200",
  preorder: "bg-blue-100 text-blue-800 border-blue-200",
};

export const ProductCard = ({ product }: { product: ProductSelect }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <Link to="/products/$id" params={{ id: product.id }}>
      <Card>
        <CardHeader className="gap-2">
          {product.badge && (
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-slate-900 px-2 py-0.5 font-semibold text-white text-xs">
                {product.badge}
              </span>
            </div>
          )}
          <CardTitle className="text-lg">{product.name}</CardTitle>
          <CardDescription>{product.description}</CardDescription>
          <CardAction>${product.price}</CardAction>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-slate-600 text-sm">
            <span className="font-semibold">{product.rating}</span>
            <span className="text-slate-400">{product.reviews}</span>
          </p>
          <span
            className={cn(
              "rounded-full border px-3 py-1 font-semibold text-xs",
              inventoryTone[product.inventory as keyof typeof inventoryTone],
            )}
          >
            {product.inventory === "in-stock"
              ? "In Stock"
              : product.inventory === "backorder"
                ? "Backordered"
                : "Preorder"}
          </span>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span className="font-semibold text-lg">${product.price}</span>
          <Button
            size="sm"
            variant="secondary"
            className="bg-slate-900 text-white hover:bg-slate-800"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await mutateCartFn({
                data: {
                  action: "add",
                  productId: product.id,
                  quantity: 1,
                },
              });
              await router.invalidate({ sync: true });
              await queryClient.invalidateQueries({ queryKey: ["cart-items-data"] });
            }}
          >
            <ShoppingBagIcon size={16} /> Add to Card
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};
