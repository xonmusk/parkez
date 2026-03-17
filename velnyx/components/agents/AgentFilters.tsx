"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import CategoryPill from "./CategoryPill";

export default function AgentFilters({
  activeCategory,
  sortBy,
  searchQuery,
  onCategoryChange,
  onSortChange,
  onSearchChange,
}: {
  activeCategory: string;
  sortBy: string;
  searchQuery: string;
  onCategoryChange: (cat: string) => void;
  onSortChange: (sort: string) => void;
  onSearchChange: (q: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Search and sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-dark w-full pl-11 rounded-full"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="input-dark rounded-full px-5 text-sm appearance-none bg-bg-card cursor-pointer min-w-[160px]"
        >
          <option value="popular">Most Popular</option>
          <option value="rating">Highest Rated</option>
          <option value="newest">Newest</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
        </select>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange("")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 border ${
            !activeCategory
              ? "bg-accent/20 text-accent border-accent/40"
              : "text-zinc-400 border-white/[0.08] hover:text-white"
          }`}
        >
          All Agents
        </button>
        {CATEGORIES.map((cat) => (
          <CategoryPill
            key={cat.slug}
            category={cat.slug}
            active={activeCategory === cat.slug}
            onClick={() => onCategoryChange(cat.slug === activeCategory ? "" : cat.slug)}
          />
        ))}
      </div>
    </div>
  );
}
