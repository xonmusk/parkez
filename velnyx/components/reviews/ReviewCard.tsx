"use client";

import RatingStars from "./RatingStars";
import { formatDistanceToNow } from "date-fns";

interface ReviewCardProps {
  rating: number;
  comment: string | null;
  buyer_name: string;
  created_at: string;
}

export default function ReviewCard({ rating, comment, buyer_name, created_at }: ReviewCardProps) {
  return (
    <div className="bg-bg-card border border-white/[0.06] rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-sm font-medium text-accent">
            {buyer_name.charAt(0)}
          </div>
          <span className="text-sm text-white font-medium">{buyer_name}</span>
        </div>
        <span className="text-xs text-zinc-500">
          {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
        </span>
      </div>
      <RatingStars rating={rating} size={14} />
      {comment && (
        <p className="text-sm text-zinc-400 mt-3 leading-relaxed">{comment}</p>
      )}
    </div>
  );
}
