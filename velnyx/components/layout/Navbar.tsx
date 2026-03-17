"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, ChevronDown } from "lucide-react";
import Button from "../ui/Button";

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center transition-all duration-300 ${
          scrolled
            ? "bg-bg-primary/80 backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-container mx-auto w-full px-6 md:px-12 lg:px-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-clash text-2xl font-semibold text-white">
            Velnyx<span className="text-accent">.</span>
          </Link>

          {/* Center links - desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/agents" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
              Explore
            </Link>
            <Link href="/agents" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
              Categories
            </Link>
            <Link href="/#how-it-works" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
              How It Works
            </Link>
          </div>

          {/* Right side - desktop */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                <Link
                  href={(session.user as any)?.role === "seller" ? "/dashboard/seller" : "/dashboard"}
                  className="text-zinc-400 hover:text-white transition-colors text-sm font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-zinc-500 hover:text-white transition-colors text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-zinc-400 hover:text-white transition-colors text-sm font-medium"
                >
                  Log In
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-zinc-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-bg-primary/95 backdrop-blur-xl pt-20">
          <div className="flex flex-col items-center gap-8 pt-12">
            <Link
              href="/agents"
              className="text-2xl font-clash font-semibold text-white"
              onClick={() => setMobileOpen(false)}
            >
              Explore
            </Link>
            <Link
              href="/agents"
              className="text-2xl font-clash font-semibold text-zinc-400"
              onClick={() => setMobileOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="/#how-it-works"
              className="text-2xl font-clash font-semibold text-zinc-400"
              onClick={() => setMobileOpen(false)}
            >
              How It Works
            </Link>
            <div className="border-t border-white/[0.06] w-32 my-2" />
            {session ? (
              <>
                <Link
                  href={(session.user as any)?.role === "seller" ? "/dashboard/seller" : "/dashboard"}
                  className="text-xl font-clash text-zinc-400"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="text-xl font-clash text-zinc-500"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xl font-clash text-zinc-400"
                  onClick={() => setMobileOpen(false)}
                >
                  Log In
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button size="lg">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
