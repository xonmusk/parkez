"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-6">
      <div className="w-full max-w-[480px]">
        <div className="text-center mb-10">
          <h1 className="font-clash text-4xl font-bold text-white mb-3">Welcome back</h1>
          <p className="text-zinc-400">Sign in to your Velnyx account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" loading={loading} className="w-full">
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-8">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-accent hover:text-accent-light">
            Create one
          </Link>
        </p>

        <div className="mt-6 bg-bg-card border border-white/[0.06] rounded-xl p-4 text-center">
          <p className="text-xs text-zinc-500 mb-1">Demo Account</p>
          <p className="text-sm text-zinc-400">demo@velnyx.com / demo1234</p>
        </div>
      </div>
    </div>
  );
}
