import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/content/site";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="text-snow">
        <Logo className="h-12 w-12" />
      </div>
      <p className="eyebrow mt-8">Error 404</p>
      <h1 className="font-display mt-4 text-4xl font-semibold text-snow sm:text-6xl">This frame does not exist.</h1>
      <p className="mt-4 max-w-md text-fog">The page you asked for was cut. Head back to the studio.</p>
      <Link
        href="/"
        className="mt-10 rounded-full bg-snow px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-white"
      >
        Back to {site.name}
      </Link>
    </main>
  );
}
