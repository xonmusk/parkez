"use client";

import { Star } from "lucide-react";

export default function RatingStars({
  rating,
  size = 16,
  interactive = false,
  onChange,
}: {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= rating
              ? "fill-amber text-amber"
              : "fill-none text-zinc-600"
          }
          onClick={() => interactive && onChange?.(star)}
          style={interactive ? { cursor: "pointer" } : undefined}
        />
      ))}
    </div>
  );
}
