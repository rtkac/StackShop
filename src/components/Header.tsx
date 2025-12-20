import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-slate-200 border-b bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="flex items-center gap-3">
        <Link to="/">StackShop</Link>
      </div>
      <nav className="items-center gap-3 font-medium text-slate-700 text-sm sm:flex dark:text-slate-200">
        <Link to="/products">Products</Link>
        {/* <Link to="/cart">Cart</Link> */}
      </nav>
    </header>
  );
}
