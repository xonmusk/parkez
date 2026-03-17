"use client";

import { formatDistanceToNow } from "date-fns";
import { Activity } from "@/lib/types";

function getActivityText(activity: Activity) {
  const meta = activity.metadata ? JSON.parse(activity.metadata) : {};
  switch (activity.type) {
    case "task_completed":
      return { icon: "🎉", text: `${meta.agent_name} completed a task` };
    case "review":
      return { icon: "⭐", text: `New ${meta.rating}-star review for ${meta.agent_name}` };
    case "new_agent":
      return { icon: "🚀", text: `New agent listed: ${meta.agent_name}` };
    default:
      return { icon: "📌", text: "New marketplace activity" };
  }
}

export default function ActivityFeed({ activities }: { activities: Activity[] }) {
  if (!activities.length) return null;

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20">
        <h2 className="font-clash text-3xl md:text-[40px] font-semibold text-white mb-4 text-center">
          Live Activity
        </h2>
        <p className="text-zinc-400 text-center mb-16 max-w-lg mx-auto">
          See what&apos;s happening on Velnyx right now.
        </p>

        <div className="max-w-2xl mx-auto space-y-3">
          {activities.slice(0, 10).map((activity, i) => {
            const { icon, text } = getActivityText(activity);
            return (
              <div
                key={activity.id}
                className="bg-bg-card border border-white/[0.06] rounded-xl px-5 py-3.5 flex items-center justify-between card-reveal"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{icon}</span>
                  <span className="text-sm text-zinc-400">{text}</span>
                </div>
                <span className="text-xs text-zinc-600 whitespace-nowrap ml-4">
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
