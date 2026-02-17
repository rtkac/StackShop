import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ArrowRightIcon } from "lucide-react";

import { ProductCard } from "@/components/ProductCard";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const fetchRecommendedProductsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getRecommendedProducts } = await import("@/data/products");
  const data = await getRecommendedProducts();
  return data;
});

export const Route = createFileRoute("/")({
  component: App,
  loader: async () => {
    return fetchRecommendedProductsFn();
  },
});

async function App() {
  const products = Route.useLoaderData();

  return (
    <div className="space-y-12 bg-linear-to-b from-slate-50 via-white to-slate-50 p-6">
      <section>
        <Card className="bg-white/80 p-8 shadow-md">
          <p className="font-semibold text-blue-600 text-sm uppercase leading-wide">
            Your favourite e-commerce store
          </p>
          <CardTitle className="max-w-2xl font-bold text-4xl text-slate-900 leading-tight dark:text-white">
            <h1>StackShop - Your one-stop shop for all your needs</h1>
          </CardTitle>
          <CardDescription>
            <Link
              to="/products"
              className="hover:-translate-y-0.5 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 font-semibold text-sm text-white shadow-lg transition hover:shadow-xl"
            >
              Browse products
              <ArrowRightIcon size={16} />
            </Link>
          </CardDescription>
        </Card>
      </section>

      <section>
        <Card className="bg-white/80 p-8 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <CardHeader className="px-0">
                <p className="font-semibold text-blue-600 text-xs uppercase tracking-wide">
                  Recommended
                </p>
                <CardTitle className="font-semibold text-2xl text-slate-900">
                  Starter picks from the catalog
                </CardTitle>
              </CardHeader>
              <CardDescription className="text-slate-600 text-sm">
                Curated items to try cart and detail pages quickly.
              </CardDescription>
            </div>
            <div>
              <Link
                to="/products"
                className="hover:-translate-y-0.5 hover: hidden items-center gap-2 rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-700 text-xs transition hover:shadow-xl sm:inline-flex"
              >
                View All <ArrowRightIcon size={14} />
              </Link>
            </div>
          </div>
        </Card>
      </section>
      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
