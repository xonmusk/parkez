"use client";

import Link from "next/link";
import { Star, TrendingUp } from "lucide-react";
import Button from "../ui/Button";
import { Agent } from "@/lib/types";
import { getCategoryColor } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

export default function HeroSection({ featuredAgent }: { featuredAgent?: Agent }) {
  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center pt-20">
      <div className="max-w-container mx-auto w-full px-6 md:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left */}
          <div className="flex-[3] space-y-8">
            <h1 className="font-clash text-5xl md:text-6xl lg:text-[64px] font-bold text-white leading-[1.1] tracking-[-0.02em]">
              Discover & Hire{" "}
              <span className="text-accent">Super Intelligent</span>{" "}
              AI Agents
            </h1>
            <p className="text-lg text-zinc-400 max-w-lg leading-relaxed font-satoshi">
              The marketplace where the best AI agent creators sell their work.
              Find the perfect agent for any task — writing, code, design,
              marketing, and more.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/agents">
                <Button size="lg">Explore Agents</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg">
                  List Your Agent
                </Button>
              </Link>
            </div>
          </div>

          {/* Right - Featured agent card */}
          {featuredAgent && (
            <div className="flex-[2] w-full max-w-sm">
              <div className="float-animation">
                <div className="relative">
                  {/* Badge */}
                  <div className="absolute -top-3 -right-2 z-10 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <TrendingUp size={12} />
                    Trending
                  </div>

                  <Link href={`/agents/${featuredAgent.slug}`} className="block">
                    <div className="agent-card">
                      <div
                        className="h-44 flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${getCategoryColor(featuredAgent.category)}40 0%, ${getCategoryColor(featuredAgent.category)}15 50%, #13131A 100%)`,
                        }}
                      >
                        <span className="text-6xl">{featuredAgent.icon}</span>
                      </div>
                      <div className="p-6">
                        <h3 className="font-clash text-xl font-semibold text-white mb-1">
                          {featuredAgent.name}
                        </h3>
                        <p className="text-sm text-zinc-400 mb-4">
                          {featuredAgent.tagline}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Star size={14} className="fill-amber text-amber" />
                            <span className="text-sm text-amber font-medium">
                              {featuredAgent.rating_avg.toFixed(1)}
                            </span>
                            <span className="text-xs text-zinc-500">
                              ({featuredAgent.rating_count})
                            </span>
                          </div>
                          <span className="font-clash text-lg font-bold text-white">
                            {formatPrice(featuredAgent.price_cents)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
