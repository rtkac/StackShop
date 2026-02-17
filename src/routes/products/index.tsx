import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createMiddleware, createServerFn } from "@tanstack/react-start";

import { ProductCard } from "@/components/ProductCard";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const fetchProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { getAllProducts } = await import("@/data/products");
  const data = await getAllProducts();
  return data;
});

const logerMiddleware = createMiddleware().server(async ({ next }) => {
  return next();
});

export const Route = createFileRoute("/products/")({
  component: RouteComponent,
  loader: async () => {
    return fetchProducts();
  },
  server: {
    middleware: [logerMiddleware],
  },
});

function RouteComponent() {
  const products = Route.useLoaderData();
  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    initialData: products,
  });

  return (
    <div className="space-y-12 bg-linear-to-b from-slate-50 via-white to-slate-50 p-6">
      <section>
        <Card className="bg-white/80 p-8 shadow-md">
          <p className="font-semibold text-blue-600 text-xs uppercase tracking-wide">
            Startshop catalog
          </p>
          <CardTitle className="font-semibold text-2xl text-slate-900">
            <h1>Products built for makers</h1>
          </CardTitle>
          <CardDescription className="text-slate-600 text-sm">
            Browse our selection of products designed for creators and innovators.
          </CardDescription>
        </Card>
      </section>
      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
