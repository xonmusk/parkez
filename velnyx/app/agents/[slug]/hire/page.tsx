"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Download, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import ReviewForm from "@/components/reviews/ReviewForm";
import Link from "next/link";

interface AgentInfo {
  id: number;
  name: string;
  slug: string;
  icon: string;
  tagline: string;
  price_cents: number;
  category: string;
  example_input: string | null;
}

export default function HireAgentPage() {
  const { slug } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [agent, setAgent] = useState<AgentInfo | null>(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [taskId, setTaskId] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    fetch(`/api/agents/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setAgent(data.agent);
        if (data.agent?.example_input) {
          setInput(data.agent.example_input);
        }
      });
  }, [slug, status, router]);

  const handleSubmit = async () => {
    if (!agent || !input.trim()) return;
    setProcessing(true);
    setOutput("");
    setDone(false);

    try {
      const res = await fetch("/api/tasks/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent_id: agent.id, input_text: input }),
      });

      if (!res.ok) {
        // Fallback to non-streaming
        const fallbackRes = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agent_id: agent.id, input_text: input }),
        });
        const task = await fallbackRes.json();
        setOutput(task.output_text || "Something went wrong.");
        setTaskId(task.id);
        setDone(true);
        setProcessing(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;

      while (true) {
        const { done: readerDone, value } = await reader.read();
        if (readerDone) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "task_id") {
                setTaskId(data.task_id);
              } else if (data.type === "delta") {
                setOutput((prev) => prev + data.text);
              } else if (data.type === "done") {
                setDone(true);
                setProcessing(false);
              } else if (data.type === "error") {
                setOutput(data.message || "Something went wrong.");
                setDone(true);
                setProcessing(false);
              }
            } catch {}
          }
        }
      }

      setProcessing(false);
      setDone(true);
    } catch {
      setOutput("Something went wrong. Please try again.");
      setProcessing(false);
      setDone(true);
    }
  };

  const copyOutput = () => navigator.clipboard.writeText(output);
  const downloadOutput = () => {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${agent?.name || "output"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (outputRef.current && processing) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, processing]);

  if (!agent) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="processing-glow w-16 h-16 rounded-2xl bg-bg-card flex items-center justify-center text-3xl">
          🤖
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <Link
          href={`/agents/${slug}`}
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to {agent.name}
        </Link>

        {/* Agent summary */}
        <div className="bg-bg-card border border-white/[0.06] rounded-card p-6 mb-8 flex items-center gap-4">
          <span className="text-4xl">{agent.icon}</span>
          <div>
            <h2 className="font-clash text-xl font-semibold text-white">{agent.name}</h2>
            <p className="text-sm text-zinc-400">{agent.tagline}</p>
          </div>
          <span className="ml-auto font-clash text-xl font-bold text-white">
            ${(agent.price_cents / 100).toFixed(2)}
          </span>
        </div>

        {/* Input */}
        {!output && !processing && (
          <div className="space-y-6">
            <div>
              <label className="text-zinc-400 text-xs uppercase tracking-[0.05em] font-medium mb-2 block">
                Describe your task
              </label>
              <textarea
                className="input-dark w-full h-44 resize-none text-base"
                placeholder={agent.example_input || "Describe what you need..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <Button onClick={handleSubmit} className="w-full" size="lg" disabled={!input.trim()}>
              Run Task — ${(agent.price_cents / 100).toFixed(2)}
            </Button>
          </div>
        )}

        {/* Processing */}
        {processing && !output && (
          <div className="text-center py-16">
            <div className="processing-glow w-20 h-20 rounded-2xl bg-bg-card border border-white/[0.06] flex items-center justify-center text-4xl mx-auto mb-6">
              {agent.icon}
            </div>
            <p className="font-clash text-xl font-semibold text-white mb-2">Working on it...</p>
            <p className="text-sm text-zinc-500">{agent.name} is processing your request</p>
          </div>
        )}

        {/* Output */}
        {output && (
          <div className="space-y-6">
            {processing && (
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
                <span className="text-sm text-zinc-400">Generating...</span>
              </div>
            )}

            <div
              ref={outputRef}
              className="bg-bg-card border border-white/[0.06] rounded-card p-6 md:p-8 max-h-[600px] overflow-y-auto"
            >
              <div className="markdown-output">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
              </div>
            </div>

            {done && (
              <>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={copyOutput} className="flex-1">
                    <Copy size={16} /> Copy
                  </Button>
                  <Button variant="outline" onClick={downloadOutput} className="flex-1">
                    <Download size={16} /> Download
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setOutput("");
                    setDone(false);
                    setTaskId(null);
                    setInput("");
                  }}
                  className="w-full text-center"
                >
                  Run Another Task
                </Button>

                {taskId && <ReviewForm taskId={taskId} />}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
