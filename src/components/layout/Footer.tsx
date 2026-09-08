import { Logo } from "@/components/ui/Logo";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-ink">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3 text-snow">
            <Logo />
            <span className="font-display text-lg font-semibold">{site.name}</span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-fog">{site.tagline}</p>
        </div>

        <div>
          <p className="eyebrow">Studio</p>
          <ul className="mt-4 space-y-2 text-sm text-mist">
            {site.nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="transition-colors hover:text-snow">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">Elsewhere</p>
          <ul className="mt-4 space-y-2 text-sm text-mist">
            {site.social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="transition-colors hover:text-snow"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-fog">{site.location}</p>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-fog sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </span>
          <span className="font-mono tracking-[0.2em]">MADE WITH TASTE AND MACHINES</span>
        </div>
      </div>
    </footer>
  );
}
