import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/features/header/components/Header";
import DbInicializer from "@/components/inicializer/DbInicializer";

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
      className={`${geistSans.variable} ${geistMono.variable} h-dvh antialiased`}
    >
      <body className="h-dvh">
        
        <div className="w-full h-full relative flex flex-col gap-0 bg-Surface overflow-hidden">
          <DbInicializer/>
          <Header className="w-full"/>
          
          <div className="w-full h-full min-h-0 flex-1">{children}</div>
        </div>
      
      </body>
    </html>
  );
}
