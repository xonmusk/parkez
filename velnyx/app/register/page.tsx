"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      await signIn("credentials", { email, password, redirect: false });
      router.push(role === "seller" || role === "both" ? "/dashboard/seller" : "/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  const roles = [
    { value: "buyer", label: "I want to hire agents", desc: "Browse and hire AI agents for your tasks" },
    { value: "seller", label: "I want to sell agents", desc: "Create and monetize your own AI agents" },
    { value: "both", label: "Both", desc: "Hire agents and sell your own" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-6 py-12">
      <div className="w-full max-w-[480px]">
        <div className="text-center mb-10">
          <h1 className="font-clash text-4xl font-bold text-white mb-3">Create your account</h1>
          <p className="text-zinc-400">Join the AI agent marketplace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <Input
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />

          <div className="space-y-2">
            <label className="text-zinc-400 text-xs uppercase tracking-[0.05em] font-medium">
              I want to...
            </label>
            <div className="space-y-2">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                    role === r.value
                      ? "border-accent bg-accent/5"
                      : "border-white/[0.08] bg-bg-card hover:border-white/[0.12]"
                  }`}
                >
                  <p className={`text-sm font-medium ${role === r.value ? "text-accent" : "text-white"}`}>
                    {r.label}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" loading={loading} className="w-full">
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:text-accent-light">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
