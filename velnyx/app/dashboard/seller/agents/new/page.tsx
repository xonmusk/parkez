"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { CATEGORIES } from "@/lib/constants";

export default function CreateAgentPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    tagline: "",
    description: "",
    category: "writing",
    icon: "🤖",
    price: "2.99",
    system_prompt: "",
    welcome_message: "",
    example_input: "",
    example_output: "",
    tags: "",
  });

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price_cents: Math.round(parseFloat(form.price) * 100),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create agent");
        setLoading(false);
        return;
      }

      const data = await res.json();
      router.push(`/agents/${data.slug}`);
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="font-clash text-3xl md:text-4xl font-bold text-white mb-2">
          Create New Agent
        </h1>
        <p className="text-zinc-400 mb-10">
          Build an AI agent and start earning when people hire it.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          {/* Basics */}
          <div className="space-y-5">
            <h2 className="font-clash text-xl font-semibold text-white">Basics</h2>
            <div className="grid grid-cols-[80px_1fr] gap-4">
              <div>
                <label className="text-zinc-400 text-xs uppercase tracking-[0.05em] font-medium mb-2 block">Icon</label>
                <input
                  type="text"
                  value={form.icon}
                  onChange={(e) => update("icon", e.target.value)}
                  className="input-dark w-full text-center text-3xl h-[52px]"
                  maxLength={2}
                />
              </div>
              <Input label="Agent Name" placeholder="e.g. BlogForge" value={form.name} onChange={(e) => update("name", e.target.value)} required />
            </div>
            <Input label="Tagline" placeholder="A short description of what your agent does" value={form.tagline} onChange={(e) => update("tagline", e.target.value)} required />

            <div>
              <label className="text-zinc-400 text-xs uppercase tracking-[0.05em] font-medium mb-2 block">Category</label>
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="input-dark w-full appearance-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-5">
            <h2 className="font-clash text-xl font-semibold text-white">Description</h2>
            <Textarea label="Full Description" placeholder="Describe what your agent does, its capabilities, and why someone should hire it..." value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} required />
            <Input label="Tags" placeholder="comma, separated, tags" value={form.tags} onChange={(e) => update("tags", e.target.value)} />
          </div>

          {/* System Prompt */}
          <div className="space-y-5">
            <h2 className="font-clash text-xl font-semibold text-white">System Prompt</h2>
            <p className="text-sm text-zinc-500">This is the instruction that powers your agent. It tells the AI how to behave and what to produce.</p>
            <Textarea label="System Prompt" placeholder="You are [Agent Name], an expert in... When given [input type], produce [output type]..." value={form.system_prompt} onChange={(e) => update("system_prompt", e.target.value)} rows={8} required />
          </div>

          {/* Pricing */}
          <div className="space-y-5">
            <h2 className="font-clash text-xl font-semibold text-white">Pricing</h2>
            <div className="relative">
              <Input label="Price per Task (USD)" type="number" step="0.01" min="0.01" max="99.99" placeholder="2.99" value={form.price} onChange={(e) => update("price", e.target.value)} required />
            </div>
          </div>

          {/* Sample Work */}
          <div className="space-y-5">
            <h2 className="font-clash text-xl font-semibold text-white">Sample Work</h2>
            <Textarea label="Example Input" placeholder="A sample task input to show potential buyers" value={form.example_input} onChange={(e) => update("example_input", e.target.value)} rows={3} />
            <Textarea label="Example Output" placeholder="What your agent would produce for the example input" value={form.example_output} onChange={(e) => update("example_output", e.target.value)} rows={5} />
          </div>

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Create Agent
          </Button>
        </form>
      </div>
    </div>
  );
}
