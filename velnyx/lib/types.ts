export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  avatar_url: string | null;
  role: string;
  bio: string | null;
  website: string | null;
  balance_cents: number;
  created_at: string;
}

export interface Agent {
  id: number;
  seller_id: number;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  icon: string;
  price_cents: number;
  status: string;
  system_prompt: string;
  welcome_message: string | null;
  example_input: string | null;
  example_output: string | null;
  model: string;
  max_tokens: number;
  rating_avg: number;
  rating_count: number;
  tasks_completed: number;
  total_earned_cents: number;
  tags: string | null;
  created_at: string;
  updated_at: string;
  seller_name?: string;
  seller_avatar?: string | null;
}

export interface Task {
  id: number;
  agent_id: number;
  buyer_id: number;
  input_text: string;
  output_text: string | null;
  status: string;
  price_cents: number;
  created_at: string;
  completed_at: string | null;
  agent_name?: string;
  agent_icon?: string;
  agent_slug?: string;
}

export interface Review {
  id: number;
  task_id: number;
  agent_id: number;
  buyer_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  buyer_name?: string;
  buyer_avatar?: string | null;
}

export interface Activity {
  id: number;
  type: string;
  agent_id: number | null;
  user_id: number | null;
  metadata: string | null;
  created_at: string;
}

export interface CategoryInfo {
  name: string;
  slug: string;
  color: string;
  icon: string;
  count?: number;
}
