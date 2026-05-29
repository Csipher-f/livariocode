import Link from "next/link";

const footerSections = [
  {
    title: "Explore",
    links: [
      { href: "/listings", label: "Browse homes" },
      { href: "/#how-it-works", label: "How it works" },
      { href: "/signup", label: "List your property" },
    ],
  },
  {
    title: "Livario",
    links: [
      { href: "/login", label: "Log in" },
      { href: "/signup", label: "Get started" },
      { href: "/listings", label: "Featured listings" },
    ],
  },
  {
    title: "Social",
    links: [
      { href: "#", label: "Instagram" },
      { href: "#", label: "X" },
      { href: "#", label: "LinkedIn" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_2fr] lg:px-8">
        <div>
          <Link className="text-xl font-semibold tracking-tight" href="/">
            Livario
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
            A premium housing discovery platform helping people find and list
            homes across Nigeria.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-semibold">{section.title}</h2>
              <ul className="mt-4 grid gap-3 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  <li key={`${section.title}-${link.label}`}>
                    <Link
                      className="transition-colors hover:text-foreground"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>Copyright {new Date().getFullYear()} Livario. All rights reserved.</p>
          <p>Built for modern renting.</p>
        </div>
      </div>
    </footer>
  );
}
