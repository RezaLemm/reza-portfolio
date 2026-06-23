import Link from "next/link";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Canvas", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-[#2a2a2a]/70 bg-[#090909]/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl font-semibold tracking-[-0.06em] text-[#c9a46a]">
            LS
          </span>

          <span className="hidden text-sm font-semibold uppercase tracking-[0.22em] text-[#f2f2f2] sm:block">
            LEMM Studio
          </span>
        </Link>

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
      </nav>
    </header>
  );
}