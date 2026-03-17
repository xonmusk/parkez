"use client";

import { getCategoryColor, getCategoryInfo } from "@/lib/constants";

export default function CategoryPill({
  category,
  active = false,
  onClick,
}: {
  category: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const info = getCategoryInfo(category);
  const color = info?.color || getCategoryColor(category);

  return (
    <button
      onClick={onClick}
      className="rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 whitespace-nowrap"
      style={{
        backgroundColor: active ? color + "20" : "transparent",
        color: active ? color : "#A1A1AA",
        border: `1px solid ${active ? color + "40" : "rgba(255,255,255,0.08)"}`,
      }}
    >
      {info?.icon} {info?.name || category}
    </button>
  );
}
