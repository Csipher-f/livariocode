import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", geistSans.variable, geistMono.variable)}
    >
      <body className="flex min-h-full flex-col antialiased">
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
