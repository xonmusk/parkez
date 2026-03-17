"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CheckCircle, DollarSign, Star, Clock } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { formatPrice } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface TaskItem {
  id: number;
  agent_name: string;
  agent_icon: string;
  agent_slug: string;
  input_text: string;
  output_text: string | null;
  status: string;
  price_cents: number;
  created_at: string;
}

export default function BuyerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      if ((session.user as any)?.role === "seller") {
        router.push("/dashboard/seller");
        return;
      }
      fetch("/api/tasks")
        .then((r) => r.json())
        .then((data) => {
          setTasks(Array.isArray(data) ? data : []);
          setLoading(false);
        });
    }
  }, [status, session, router]);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-20">
        <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20">
          <div className="skeleton h-8 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton h-28" />)}
          </div>
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter((t) => t.status === "completed");
  const totalSpent = completedTasks.reduce((sum, t) => sum + t.price_cents, 0);

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20">
        <h1 className="font-clash text-3xl md:text-4xl font-bold text-white mb-2">
          Welcome back, {session?.user?.name?.split(" ")[0]}
        </h1>
        <p className="text-zinc-400 mb-10">Here&apos;s your task history and stats.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard label="Tasks Completed" value={completedTasks.length} icon={CheckCircle} color="#10B981" />
          <StatCard label="Total Spent" value={formatPrice(totalSpent)} icon={DollarSign} color="#F59E0B" />
          <StatCard label="Agents Used" value={new Set(tasks.map((t) => t.agent_name)).size} icon={Star} color="#8B5CF6" />
        </div>

        <h2 className="font-clash text-2xl font-semibold text-white mb-6">Task History</h2>

        {tasks.length === 0 ? (
          <div className="text-center py-16 bg-bg-card border border-white/[0.06] rounded-card">
            <p className="text-4xl mb-4">🤖</p>
            <h3 className="font-clash text-xl font-semibold text-white mb-2">No tasks yet</h3>
            <p className="text-zinc-400 mb-6">Hire an agent to get started!</p>
            <Link href="/agents" className="btn-primary inline-block">
              Browse Agents
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="bg-bg-card border border-white/[0.06] rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                  className="w-full p-5 flex items-center gap-4 text-left hover:bg-bg-card-hover transition-colors"
                >
                  <span className="text-2xl">{task.agent_icon}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate">{task.agent_name}</h4>
                    <p className="text-sm text-zinc-500 truncate">{task.input_text}</p>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.status === "completed" ? "bg-success/10 text-success" :
                      task.status === "processing" ? "bg-accent/10 text-accent" :
                      "bg-danger/10 text-danger"
                    }`}>
                      {task.status}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </button>

                {expandedTask === task.id && task.output_text && (
                  <div className="border-t border-white/[0.06] p-5">
                    <div className="markdown-output text-sm">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{task.output_text}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
