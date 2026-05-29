import { Link } from "react-router-dom";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <section className="section-shell flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="section-kicker">Error 404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
        The page you were looking for may have moved or no longer exists. Let&apos;s get you back to
        comparing rates.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link to="/" className="button-primary">
          <Home className="h-4 w-4" />
          Back home
        </Link>
        <Link to="/rates/search" className="button-secondary">
          <Compass className="h-4 w-4" />
          Compare rates
        </Link>
      </div>
    </section>
  );
}
