import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Movie Discovery — Explore Thousands of Movies",
  description:
    "Discover trending movies, search by title, save your favorites, and never miss a great film. Powered by TMDB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="min-h-screen font-[family-name:var(--font-inter)] antialiased">
        {children}
      </body>
    </html>
  );
}
