"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Clock, CheckCircle, Zap } from "lucide-react";
import { Agent, Review } from "@/lib/types";
import { getCategoryColor, getCategoryInfo } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import ReviewCard from "@/components/reviews/ReviewCard";
import AgentCard from "@/components/agents/AgentCard";

export default function AgentProfileClient({
  agent,
  reviews,
  relatedAgents,
}: {
  agent: Agent & { seller_bio?: string; seller_user_id?: number };
  reviews: Review[];
  relatedAgents: Agent[];
}) {
  const [tab, setTab] = useState<"about" | "sample" | "reviews">("about");
  const color = getCategoryColor(agent.category);
  const catInfo = getCategoryInfo(agent.category);

  return (
    <div className="min-h-screen">
      {/* Gradient header */}
      <div
        className="h-64 md:h-80 relative"
        style={{
          background: `linear-gradient(180deg, ${color}25 0%, ${color}08 60%, #0B0B0F 100%)`,
        }}
      />

      <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20 -mt-32 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main content */}
          <div className="flex-1">
            {/* Agent header */}
            <div className="flex items-start gap-6 mb-8">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
                style={{ backgroundColor: color + "20" }}
              >
                {agent.icon}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="font-clash text-3xl md:text-4xl lg:text-[48px] font-bold text-white leading-tight">
                    {agent.name}
                  </h1>
                </div>
                <p className="text-lg text-zinc-400 mb-3">{agent.tagline}</p>
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs font-medium uppercase tracking-[0.05em] px-3 py-1 rounded-full"
                    style={{ backgroundColor: color + "15", color }}
                  >
                    {catInfo?.name || agent.category}
                  </span>
                  <span className="text-sm text-zinc-500">
                    by{" "}
                    <Link
                      href={`/sellers/${(agent as any).seller_user_id || agent.seller_id}`}
                      className="text-accent hover:text-accent-light"
                    >
                      {agent.seller_name}
                    </Link>
                  </span>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { icon: Star, label: "Rating", value: `${agent.rating_avg.toFixed(1)} (${agent.rating_count})`, iconColor: "#F59E0B" },
                { icon: CheckCircle, label: "Completed", value: `${agent.tasks_completed} tasks`, iconColor: "#10B981" },
                { icon: Clock, label: "Response", value: "< 30 seconds", iconColor: "#8B5CF6" },
                { icon: Zap, label: "Price", value: formatPrice(agent.price_cents), iconColor: "#F59E0B" },
              ].map((stat, i) => (
                <div key={i} className="bg-bg-card border border-white/[0.06] rounded-xl p-4 text-center">
                  <stat.icon size={18} className="mx-auto mb-2" style={{ color: stat.iconColor }} />
                  <p className="text-xs text-zinc-500 mb-1">{stat.label}</p>
                  <p className="text-sm font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-white/[0.06] mb-8">
              {(["about", "sample", "reviews"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-3 text-sm font-medium transition-colors relative ${
                    tab === t ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {t === "about" ? "About" : t === "sample" ? "Sample Work" : `Reviews (${reviews.length})`}
                  {tab === t && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {tab === "about" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-clash text-xl font-semibold text-white mb-3">Description</h3>
                  <p className="text-zinc-400 leading-relaxed">{agent.description}</p>
                </div>
                {agent.tags && (
                  <div>
                    <h3 className="font-clash text-xl font-semibold text-white mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {agent.tags.split(",").map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-zinc-400 bg-white/5 px-3 py-1.5 rounded-full"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === "sample" && (
              <div className="space-y-6">
                {agent.example_input && (
                  <div>
                    <h3 className="font-clash text-xl font-semibold text-white mb-3">Example Input</h3>
                    <div className="bg-bg-card border border-white/[0.06] rounded-xl p-5">
                      <p className="text-zinc-400 text-sm">{agent.example_input}</p>
                    </div>
                  </div>
                )}
                {agent.example_output && (
                  <div>
                    <h3 className="font-clash text-xl font-semibold text-white mb-3">Example Output</h3>
                    <div className="bg-bg-card border border-white/[0.06] rounded-xl p-5">
                      <p className="text-zinc-400 text-sm whitespace-pre-wrap">{agent.example_output}</p>
                    </div>
                  </div>
                )}
                {!agent.example_input && !agent.example_output && (
                  <p className="text-zinc-500 text-center py-8">No sample work available yet.</p>
                )}
              </div>
            )}

            {tab === "reviews" && (
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      rating={review.rating}
                      comment={review.comment}
                      buyer_name={review.buyer_name || "Anonymous"}
                      created_at={review.created_at}
                    />
                  ))
                ) : (
                  <p className="text-zinc-500 text-center py-8">No reviews yet.</p>
                )}
              </div>
            )}

            {/* Related agents */}
            {relatedAgents.length > 0 && (
              <div className="mt-16">
                <h3 className="font-clash text-2xl font-semibold text-white mb-8">Related Agents</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedAgents.map((a, i) => (
                    <AgentCard key={a.id} agent={a} index={i} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-28 space-y-4">
              <div className="bg-bg-card border border-white/[0.06] rounded-card p-6">
                <div className="text-center mb-6">
                  <p className="text-xs text-zinc-500 uppercase tracking-[0.05em] mb-2">Price per task</p>
                  <p className="font-clash text-4xl font-bold text-white">
                    {formatPrice(agent.price_cents)}
                  </p>
                </div>
                <Link href={`/agents/${agent.slug}/hire`}>
                  <Button className="w-full" size="lg">
                    Hire This Agent
                  </Button>
                </Link>
                <p className="text-xs text-zinc-500 text-center mt-4">
                  Results delivered in under 30 seconds
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
