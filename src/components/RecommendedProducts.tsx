import { use } from "react";

import { ProductCard } from "./ProductCard";
import { Card } from "./ui/card";

import type { ProductSelect } from "@/db/schema";

type RecommendedProductsProps = {
  data: Promise<ProductSelect[]>;
};

export const RecommendedProducts = ({ data }: RecommendedProductsProps) => {
  const products = use(data);
  return (
    <section>
      <Card>
        <h2>Recommended Products</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Card>
    </section>
  );
};
