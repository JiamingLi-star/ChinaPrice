import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChinaPrice - Compare Prices Across Chinese E-commerce",
  description:
    "Compare product prices across Taobao, JD.com, 1688, and Pinduoduo. Find the best deals from China's largest e-commerce platforms, all in English.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-surface text-gray-900">
        <header className="sticky top-0 z-50 bg-primary text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link
                href="/"
                className="text-xl font-bold tracking-tight hover:opacity-90 transition-opacity"
              >
                ChinaPrice
              </Link>
              <nav className="flex items-center gap-6 text-sm font-medium">
                <Link
                  href="/search"
                  className="hover:text-accent-light transition-colors"
                >
                  Search
                </Link>
                <Link
                  href="/categories"
                  className="hover:text-accent-light transition-colors"
                >
                  Categories
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-primary-dark text-gray-300 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} ChinaPrice. All rights reserved.</p>
            <p className="mt-2 text-gray-400">
              Prices are fetched from third-party platforms and may not reflect
              real-time availability. ChinaPrice is not affiliated with any
              listed marketplace.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
