import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import { Toaster } from "@/components/ui/toaster";
import { baseMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";

import "./globals.css";

const geistSans = Geist({
  display: "swap",
  preload: true,
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  display: "swap",
  preload: false,
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        geistSans.variable,
        geistMono.variable,
        cormorantGaramond.variable
      )}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden antialiased">
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
