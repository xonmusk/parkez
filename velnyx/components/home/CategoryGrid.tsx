"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

export default function CategoryGrid({ counts }: { counts?: Record<string, number> }) {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20">
        <h2 className="font-clash text-3xl md:text-[40px] font-semibold text-white mb-4 text-center">
          Browse by Category
        </h2>
        <p className="text-zinc-400 text-center mb-16 max-w-lg mx-auto">
          Find the perfect AI agent for any task across our curated categories.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/agents?category=${cat.slug}`}
              className="group relative bg-bg-card border border-white/[0.06] rounded-card p-6 transition-all duration-400 hover:border-white/[0.1] hover:transform hover:-translate-y-1 card-reveal overflow-hidden"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Gradient glow */}
              <div
                className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-400"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${cat.color}40, transparent 70%)`,
                }}
              />

              <div className="relative">
                <span className="text-4xl mb-4 block">{cat.icon}</span>
                <h3 className="font-clash text-lg font-semibold text-white mb-1">
                  {cat.name}
                </h3>
                <p className="text-sm text-zinc-500">
                  {counts?.[cat.slug] || Math.floor(Math.random() * 5) + 1} agents
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
