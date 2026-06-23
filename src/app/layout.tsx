import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "LEMM Studio | Graphic Design & Visual Portfolio",
  description:
    "LEMM Studio is the graphic design and visual portfolio of Reza Mousazadeh Moghddam, focused on brand identity, thumbnails, banners, advertising visuals, AI-assisted artworks, and premium presentation design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}