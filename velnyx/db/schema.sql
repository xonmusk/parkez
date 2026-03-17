CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'buyer',
  bio TEXT,
  website TEXT,
  balance_cents INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  seller_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  status TEXT DEFAULT 'active',
  system_prompt TEXT NOT NULL,
  welcome_message TEXT,
  example_input TEXT,
  example_output TEXT,
  model TEXT DEFAULT 'claude-sonnet-4-20250514',
  max_tokens INTEGER DEFAULT 2048,
  rating_avg REAL DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  total_earned_cents INTEGER DEFAULT 0,
  tags TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id INTEGER NOT NULL,
  buyer_id INTEGER NOT NULL,
  input_text TEXT NOT NULL,
  output_text TEXT,
  status TEXT DEFAULT 'processing',
  price_cents INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (agent_id) REFERENCES agents(id),
  FOREIGN KEY (buyer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id INTEGER UNIQUE NOT NULL,
  agent_id INTEGER NOT NULL,
  buyer_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id),
  FOREIGN KEY (agent_id) REFERENCES agents(id),
  FOREIGN KEY (buyer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS activity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  agent_id INTEGER,
  user_id INTEGER,
  metadata TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
