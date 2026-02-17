import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ArrowLeftIcon } from "lucide-react";
import { Suspense } from "react";

import { RecommendedProducts } from "@/components/RecommendedProducts";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProductSelect } from "@/db/schema";

const fetchProductById = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const { getProductById } = await import("@/data/products");
    const product = await getProductById(data.id);
    return product;
  });

const fetchRecommendedProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { getRecommendedProducts } = await import("@/data/products");
  return getRecommendedProducts();
});

export const Route = createFileRoute("/products/$id")({
  component: RouteComponent,
  loader: async ({ params }) => {
    // Use server functions to ensure server-only execution
    const product = await fetchProductById({ data: { id: params.id } });
    if (!product) {
      throw notFound();
    }
    // Return recommendedProducts as a Promise for Suspense
    const recommendedProducts = fetchRecommendedProducts();
    return { product, recommendedProducts };
  },
  head: ({ loaderData: data }) => {
    const { product } = data as { product: ProductSelect };
    if (!product) {
      return {};
    }
    return {
      meta: [
        { title: product ? `${product.name} - StackShop` : "Product not found - StackShop" },
        { name: "description", content: product?.description },
        { name: "image", content: product?.image },
        { name: "canonical", content: `http://localhost:3000/products/${product?.id}` },
      ],
    };
  },
});

function RouteComponent() {
  const { product, recommendedProducts } = Route.useLoaderData();

  return (
    <div>
      <Card>
        <Card>
          <CardHeader>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 font-medium text-blue-600 text-sm"
            >
              <ArrowLeftIcon size={16} /> Back to products
            </Link>
            <CardTitle className="font-semibold text-2xl">{product?.name}</CardTitle>
            {product?.badge && (
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-900 px-2 py-0.5 font-semibold text-white text-xs">
                  {product.badge}
                </span>
              </div>
            )}
            <CardDescription>{product?.description}</CardDescription>
          </CardHeader>
        </Card>
        <Suspense
          fallback={
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          }
        >
          <RecommendedProducts data={recommendedProducts} />
        </Suspense>
      </Card>
    </div>
  );
}
