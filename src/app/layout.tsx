import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { DebugFooter } from "@/components/DebugFooter";
import { Terminal, Shield, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Shikha Singh | Software Engineering & Systems Architecture",
  description: "Personal engineering portfolio, production systems architecture, and security research workbench.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen flex flex-col bg-stone-950 text-stone-200 selection:bg-clay-500/30 selection:text-clay-100">
        {/* Editorial Top Navigation */}
        <header className="border-b border-stone-800 bg-stone-950/90 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Monogram Brand Stamp */}
            <Link 
              href="/" 
              className="flex items-center space-x-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-400 rounded-lg p-1"
            >
              <div className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-700/80 flex items-center justify-center text-xs font-mono font-bold text-stone-100 shadow-sm group-hover:border-clay-500 transition-colors">
                <span>SS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-clay-500 ml-0.5"></span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold tracking-tight text-stone-100 group-hover:text-clay-400 transition-colors">
                  Shikha Singh
                </span>
                <span className="text-[10px] font-mono tracking-wider text-stone-500 uppercase">
                  Systems &amp; Architecture
                </span>
              </div>
            </Link>

            {/* Editorial Nav Links with Section Numbers */}
            <nav className="hidden md:flex items-center space-x-7 text-xs font-mono font-medium">
              <Link 
                href="/#work" 
                className="text-stone-400 hover:text-stone-100 transition-colors py-1 flex items-center space-x-1"
              >
                <span className="text-clay-500/80 text-[10px]">01</span>
                <span>Work</span>
              </Link>
              <Link 
                href="/#architecture" 
                className="text-stone-400 hover:text-stone-100 transition-colors py-1 flex items-center space-x-1"
              >
                <span className="text-clay-500/80 text-[10px]">02</span>
                <span>Architecture</span>
              </Link>
              <Link 
                href="/#skills" 
                className="text-stone-400 hover:text-stone-100 transition-colors py-1 flex items-center space-x-1"
              >
                <span className="text-clay-500/80 text-[10px]">03</span>
                <span>Craft &amp; Stack</span>
              </Link>
              <Link 
                href="/#notes" 
                className="text-stone-400 hover:text-stone-100 transition-colors py-1 flex items-center space-x-1"
              >
                <span className="text-clay-500/80 text-[10px]">04</span>
                <span>Notes</span>
              </Link>
              <Link 
                href="/#contact" 
                className="text-stone-400 hover:text-stone-100 transition-colors py-1 flex items-center space-x-1"
              >
                <span className="text-clay-500/80 text-[10px]">05</span>
                <span>Contact</span>
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 hover:border-clay-500 hover:text-clay-300 text-xs font-mono transition-all"
              >
                <Terminal className="w-3.5 h-3.5 text-clay-400" />
                <span>Security Lab</span>
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center space-x-1 text-xs px-2.5 py-1.5 rounded-md text-stone-400 hover:text-stone-200 hover:bg-stone-900 border border-transparent hover:border-stone-800 transition-all font-mono"
              >
                <Shield className="w-3.5 h-3.5 text-amber-earth" />
                <span>Admin</span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg btn-clay text-xs font-semibold shadow-sm transition-all"
              >
                <span>Sign In</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col">{children}</main>

        <DebugFooter />
      </body>
    </html>
  );
}
