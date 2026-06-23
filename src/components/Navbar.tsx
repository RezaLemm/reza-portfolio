"use client";

import Link from "next/link";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/components/LanguageProvider";

export default function Navbar() {
  const { t } = useLanguage();

  const navItems = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.canvas, href: "/work" },
    { label: t.nav.about, href: "/about" },
    { label: t.nav.contact, href: "/contact" },
  ];

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-[#2a2a2a]/70 bg-[#090909]/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="font-brand text-2xl font-semibold tracking-[-0.06em] text-[#c9a46a]">
            {t.brand.mark}
          </span>

          <span className="font-brand hidden text-sm font-semibold uppercase tracking-[0.22em] text-[#f2f2f2] sm:block">
            {t.brand.name}
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-[#a8a8a8] transition hover:text-[#f2f2f2]"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <LanguageToggle />
        </div>
      </nav>
    </header>
  );
}