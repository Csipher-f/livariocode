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

import { LivarioLogo } from "@/components/livario-logo";

export function Footer() {
  return (
    <footer className="border-t border-[#3C2E20] bg-[#1C1612] text-[#F5EDE0]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_2fr] lg:px-8">
        <div>
          <Link href="/">
            <LivarioLogo variant="light" />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#A89880]">
            A premium housing discovery platform helping people find and list
            homes across Nigeria.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-semibold text-[#F5EDE0]">{section.title}</h2>
              <ul className="mt-4 grid gap-3 text-sm text-[#A89880]">
                {section.links.map((link) => (
                  <li key={`${section.title}-${link.label}`}>
                    <Link
                      className="transition-colors hover:text-[#F5EDE0]"
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
      <div className="border-t border-[#3C2E20]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-[#A89880] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>Copyright {new Date().getFullYear()} Livario. All rights reserved.</p>
          <p>Built for modern renting.</p>
        </div>
      </div>
    </footer>
  );
}
