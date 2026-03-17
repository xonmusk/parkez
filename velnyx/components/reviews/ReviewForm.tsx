"use client";

import { useState } from "react";
import RatingStars from "./RatingStars";
import Button from "../ui/Button";

export default function ReviewForm({
  taskId,
  onSubmitted,
}: {
  taskId: number;
  onSubmitted?: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: taskId, rating, comment }),
      });
      if (res.ok) {
        setSubmitted(true);
        onSubmitted?.();
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-bg-card border border-white/[0.06] rounded-xl p-6 text-center">
        <p className="text-success font-medium">Thank you for your review!</p>
      </div>
    );
  }

  return (
    <div className="bg-bg-card border border-white/[0.06] rounded-xl p-6 space-y-4">
      <h3 className="font-clash text-lg font-semibold">Rate this result</h3>
      <RatingStars rating={rating} interactive onChange={setRating} size={24} />
      <textarea
        className="input-dark w-full h-24 resize-none"
        placeholder="Share your experience..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button onClick={handleSubmit} loading={loading} className="w-full">
        Submit Review
      </Button>
    </div>
  );
}
