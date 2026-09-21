import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/shared/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Connecto",
  description: "Academic dashboard for Connecto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-dvh antialiased custom-scroll-bar overscroll-none`}
    >
      <body className="h-dvh">{children}</body>
    </html>
  );
}
