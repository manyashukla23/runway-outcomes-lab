"use client";

import { Poppins } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";

// Poppins font for the entire app - clean and classy
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <html lang="en">
      <body
        className={`${poppins.variable} font-sans antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen bg-[#FFF8F1]">
            {/* Global Navigation - only show on non-dashboard pages */}
            <div className="hidden">
              <header className="bg-white/60 backdrop-blur-sm shadow-sm border-b border-pink-100/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-16">
                    <h1 className="text-xl font-bold text-slate-900">
                      Runway Outcomes Lab – TheLook
                    </h1>
                    <nav className="flex space-x-4">
                      <Link
                        href="/dashboard"
                        className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-pink-50"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/simulator"
                        className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-pink-50"
                      >
                        Simulator
                      </Link>
                    </nav>
                  </div>
                </div>
              </header>
            </div>
            <main>{children}</main>
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
