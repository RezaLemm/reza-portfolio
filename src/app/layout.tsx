import LanguageTransitionFX from "@/components/LanguageTransitionFX"
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import InteractiveBackground from "@/components/InteractiveBackground";
import MotionConfigProvider from "@/components/MotionConfigProvider";
import { LanguageProvider } from "@/components/LanguageProvider";

const inter = localFont({
  src: [
    {
      path: "../fonts/inter/Inter-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/inter/Inter-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/inter/Inter-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/inter/Inter-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/inter/Inter-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

const peyda = localFont({
  src: [
    {
      path: "../fonts/peyda/Peyda-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/peyda/Peyda-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/peyda/Peyda-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/peyda/Peyda-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-peyda",
  display: "swap",
});

const rokh = localFont({
  src: [
    {
      path: "../fonts/rokh/Rokh-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/rokh/Rokh-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/rokh/Rokh-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-rokh",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LEMM Studio | Graphic Design & Visual Portfolio",
  description:
    "LEMM Studio is the graphic design and visual portfolio of Reza Mousazadeh, focused on brand identity, thumbnails, banners, advertising visuals, AI-assisted artworks, and premium presentation design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${peyda.variable} ${rokh.variable}`}>
        <LanguageProvider>
          <MotionConfigProvider>
            <InteractiveBackground />

            <div className="relative z-10">
              <Navbar />
              <LanguageTransitionFX>{children}</LanguageTransitionFX>
            </div>
          </MotionConfigProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}