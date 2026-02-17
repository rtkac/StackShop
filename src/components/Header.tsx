import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ShoppingBag } from "lucide-react";

const getCartItemsCountFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getCartItemsCount } = await import("@/data/cart");
  const data = await getCartItemsCount();
  return data;
});

export default function Header() {
  const { data: cartItemsData } = useQuery({
    queryKey: ["cart-items-data"],
    queryFn: getCartItemsCountFn,
  });

  return (
    <header className="sticky top-0 z-40 border-slate-200 border-b bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-800">
              <ShoppingBag size={20} />
            </div>
          </Link>
          <div className="flex flex-col">
            <span className="tet-sm font-semibold text-slate-900 dark:text-white">StackShop</span>
          </div>

          <nav className="hidden items-center gap-3 font-medium text-slate-700 text-sm sm:flex dark:text-slate-200">
            <Link
              to="/"
              className="rounded-lg px-3 py-1 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="rounded-lg px-3 py-1 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Products
            </Link>
            <Link
              to="/products/create-product"
              className="rounded-lg px-3 py-1 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Create Product
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            className="hover:-translate-y-0.5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 text-xs shadow-sm transition hover:shadow-md"
          >
            <span>Cart</span>
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-900 px-2 font-bold text-[11px] text-white">
              {cartItemsData?.count ?? 0}
            </span>
            <span className="hidden font-medium text-[11px] text-slate-500 sm:inline">
              ${cartItemsData?.total.toFixed(2) ?? 0}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
