import db from "@/db";
import { Agent, Activity } from "@/lib/types";
import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedAgents from "@/components/home/FeaturedAgents";
import HowItWorks from "@/components/home/HowItWorks";
import ActivityFeed from "@/components/home/ActivityFeed";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const featuredAgents = db.query<Agent>(
    `SELECT a.*, u.name as seller_name, u.avatar_url as seller_avatar
     FROM agents a JOIN users u ON a.seller_id = u.id
     WHERE a.status = 'active'
     ORDER BY a.tasks_completed DESC
     LIMIT 6`
  );

  const topAgent = featuredAgents[0];

  const stats = db.get<{ agent_count: number; task_count: number; avg_rating: number }>(
    `SELECT
      (SELECT COUNT(*) FROM agents WHERE status = 'active') as agent_count,
      (SELECT COUNT(*) FROM tasks WHERE status = 'completed') as task_count,
      (SELECT AVG(rating_avg) FROM agents WHERE rating_count > 0) as avg_rating`
  );

  const activities = db.query<Activity>(
    "SELECT * FROM activity ORDER BY created_at DESC LIMIT 10"
  );

  const categoryCounts = db.query<{ category: string; count: number }>(
    "SELECT category, COUNT(*) as count FROM agents WHERE status = 'active' GROUP BY category"
  );
  const counts: Record<string, number> = {};
  categoryCounts.forEach((c) => (counts[c.category] = c.count));

  return (
    <>
      <HeroSection featuredAgent={topAgent} />

      <div className="mt-[-40px] relative z-10">
        <StatsBar
          agentCount={stats?.agent_count || 11}
          taskCount={stats?.task_count || 3000}
          avgRating={stats?.avg_rating ? Math.round(stats.avg_rating * 10) / 10 : 4.8}
        />
      </div>

      <CategoryGrid counts={counts} />
      <FeaturedAgents agents={featuredAgents} />
      <HowItWorks />
      <ActivityFeed activities={activities} />

      {/* CTA Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20 text-center">
          <h2 className="font-clash text-3xl md:text-[40px] font-semibold text-white mb-6">
            Ready to build your first AI agent?
          </h2>
          <p className="text-zinc-400 mb-10 max-w-md mx-auto">
            Join our community of creators and start earning from your AI expertise today.
          </p>
          <Link
            href="/register"
            className="btn-primary text-lg px-10 py-4 inline-block"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </>
  );
}
