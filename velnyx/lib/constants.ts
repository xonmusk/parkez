import { CategoryInfo } from "./types";

export const CATEGORIES: CategoryInfo[] = [
  { name: "Writing & Content", slug: "writing", color: "#3B82F6", icon: "✍️" },
  { name: "Development & Code", slug: "development", color: "#10B981", icon: "💻" },
  { name: "Design & Creative", slug: "design", color: "#EC4899", icon: "🎨" },
  { name: "Data & Analytics", slug: "data", color: "#F97316", icon: "📊" },
  { name: "Marketing & Sales", slug: "marketing", color: "#8B5CF6", icon: "📢" },
  { name: "Audio & Video", slug: "audio-video", color: "#EF4444", icon: "🎬" },
  { name: "Research & Analysis", slug: "research", color: "#06B6D4", icon: "🔬" },
  { name: "Business & Strategy", slug: "business", color: "#F59E0B", icon: "💼" },
];

export function getCategoryColor(category: string): string {
  const cat = CATEGORIES.find(
    (c) => c.slug === category || c.name === category
  );
  return cat?.color || "#8B5CF6";
}

export function getCategoryInfo(category: string): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.slug === category || c.name === category);
}
