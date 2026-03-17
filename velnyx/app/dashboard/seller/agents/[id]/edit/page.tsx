"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { CATEGORIES } from "@/lib/constants";

export default function EditAgentPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [agent, setAgent] = useState<any>(null);

  const [form, setForm] = useState({
    name: "", tagline: "", description: "", category: "writing",
    icon: "🤖", price: "2.99", system_prompt: "", welcome_message: "",
    example_input: "", example_output: "", tags: "",
  });

  useEffect(() => {
    // Fetch agent by ID through seller stats
    fetch("/api/dashboard/seller/stats")
      .then((r) => r.json())
      .then((data) => {
        const found = data.agents?.find((a: any) => a.id === parseInt(id as string));
        if (found) {
          setAgent(found);
          setForm({
            name: found.name, tagline: found.tagline, description: found.description,
            category: found.category, icon: found.icon, price: (found.price_cents / 100).toFixed(2),
            system_prompt: found.system_prompt, welcome_message: found.welcome_message || "",
            example_input: found.example_input || "", example_output: found.example_output || "",
            tags: found.tags || "",
          });
        }
        setLoading(false);
      });
  }, [id]);

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent) return;
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/agents/${agent.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price_cents: Math.round(parseFloat(form.price) * 100),
        }),
      });

      if (!res.ok) {
        setError("Failed to update agent");
        setSaving(false);
        return;
      }

      router.push("/dashboard/seller");
    } catch {
      setError("Something went wrong");
      setSaving(false);
    }
  };

  if (loading || !agent) {
    return (
      <div className="min-h-screen pt-28 pb-20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="skeleton h-8 w-64 mb-8" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-16" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="font-clash text-3xl md:text-4xl font-bold text-white mb-2">
          Edit {agent.name}
        </h1>
        <p className="text-zinc-400 mb-10">Update your agent&apos;s configuration and pricing.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div className="grid grid-cols-[80px_1fr] gap-4">
              <div>
                <label className="text-zinc-400 text-xs uppercase tracking-[0.05em] font-medium mb-2 block">Icon</label>
                <input type="text" value={form.icon} onChange={(e) => update("icon", e.target.value)} className="input-dark w-full text-center text-3xl h-[52px]" maxLength={2} />
              </div>
              <Input label="Agent Name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
            </div>
            <Input label="Tagline" value={form.tagline} onChange={(e) => update("tagline", e.target.value)} required />
            <div>
              <label className="text-zinc-400 text-xs uppercase tracking-[0.05em] font-medium mb-2 block">Category</label>
              <select value={form.category} onChange={(e) => update("category", e.target.value)} className="input-dark w-full appearance-none cursor-pointer">
                {CATEGORIES.map((cat) => <option key={cat.slug} value={cat.slug}>{cat.icon} {cat.name}</option>)}
              </select>
            </div>
            <Textarea label="Description" value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} required />
            <Input label="Tags" value={form.tags} onChange={(e) => update("tags", e.target.value)} />
            <Textarea label="System Prompt" value={form.system_prompt} onChange={(e) => update("system_prompt", e.target.value)} rows={8} required />
            <Input label="Price (USD)" type="number" step="0.01" min="0.01" value={form.price} onChange={(e) => update("price", e.target.value)} required />
            <Textarea label="Example Input" value={form.example_input} onChange={(e) => update("example_input", e.target.value)} rows={3} />
            <Textarea label="Example Output" value={form.example_output} onChange={(e) => update("example_output", e.target.value)} rows={5} />
          </div>

          <Button type="submit" loading={saving} className="w-full" size="lg">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}
