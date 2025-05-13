import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokédex App",
  description: "A Next.js Pokédex application using the Pokémon API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        <header className="bg-red-600 text-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              Pokédex
            </Link>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link href="/" className="hover:underline">
                    Home
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        
        <main className="flex-grow">
          {children}
        </main>
        
        <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p>Pokédex App - Created with Next.js, React, and Tailwind CSS</p>
              <p className="text-sm mt-2 text-gray-400">
                Pokémon data provided by the Pokémon API
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
