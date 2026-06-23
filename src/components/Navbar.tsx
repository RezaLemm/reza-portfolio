"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/components/LanguageProvider";

const smoothEase = [0.22, 1, 0.36, 1] as const;

export default function Navbar() {
  const { t, lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const isFa = lang === "fa";

  const navItems = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.canvas, href: "/work" },
    { label: t.nav.about, href: "/about" },
    { label: t.nav.contact, href: "/contact" },
  ];

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: smoothEase }}
      className="fixed left-0 top-0 z-50 w-full border-b border-[#2a2a2a]/70 bg-[#090909]/72 backdrop-blur-2xl"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-6 md:py-5">
        <Link
          href="/"
          className="group flex items-center gap-3"
          onClick={() => setIsOpen(false)}
        >
          <span className="font-brand text-2xl font-semibold tracking-[-0.06em] text-[#c9a46a] transition group-hover:scale-105">
            {t.brand.mark}
          </span>

          <span className="font-brand hidden text-sm font-semibold uppercase tracking-[0.24em] text-[#f2f2f2] transition group-hover:text-[#c9a46a] sm:block">
            {t.brand.name}
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative text-sm font-medium text-[#a8a8a8] transition hover:text-[#f2f2f2]"
            >
              {item.label}
              <span className="absolute -bottom-2 left-0 h-px w-0 bg-[#c9a46a] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}

          <LanguageToggle />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <LanguageToggle />

          <button
            onClick={() => setIsOpen((current) => !current)}
            className="grid h-10 w-10 place-items-center rounded-full border border-[#2a2a2a] text-[#f2f2f2] transition hover:border-[#c9a46a]"
            aria-label={isOpen ? t.language.close : t.language.menu}
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: smoothEase }}
            className="overflow-hidden border-t border-[#2a2a2a] bg-[#090909]/95 px-5 backdrop-blur-2xl md:hidden"
          >
            <div
              className={`mx-auto flex max-w-7xl flex-col gap-4 py-5 ${
                isFa ? "items-end text-right" : "items-start text-left"
              }`}
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block w-full rounded-xl border border-[#2a2a2a] px-4 py-4 text-sm font-semibold text-[#f2f2f2] transition hover:border-[#c9a46a] hover:text-[#c9a46a]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}