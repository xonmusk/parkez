import Database from "better-sqlite3";
import { hashSync } from "bcryptjs";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "velnyx.db");
const SCHEMA_PATH = path.join(process.cwd(), "db", "schema.sql");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Create tables
const schema = fs.readFileSync(SCHEMA_PATH, "utf-8");
db.exec(schema);

// Clear existing data
db.exec("DELETE FROM activity");
db.exec("DELETE FROM reviews");
db.exec("DELETE FROM tasks");
db.exec("DELETE FROM agents");
db.exec("DELETE FROM users");

const sellerHash = hashSync("seller1234", 10);
const buyerHash = hashSync("demo1234", 10);

// Users
const insertUser = db.prepare(
  "INSERT INTO users (email, password_hash, name, role, bio) VALUES (?, ?, ?, ?, ?)"
);

const users = [
  ["sarah@velnyx.com", sellerHash, "Sarah Chen", "seller", "Full-stack developer turned AI agent builder"],
  ["marcus@velnyx.com", sellerHash, "Marcus Johnson", "seller", "Marketing strategist building automated campaigns"],
  ["priya@velnyx.com", sellerHash, "Priya Patel", "seller", "Data scientist specializing in AI analytics"],
  ["alex@velnyx.com", sellerHash, "Alex Rivera", "seller", "Content creator and prompt engineer"],
  ["jordan@velnyx.com", sellerHash, "Jordan Kim", "seller", "Design systems architect and UX researcher"],
  ["demo@velnyx.com", buyerHash, "Demo Buyer", "buyer", "Exploring AI agents for my business"],
];

for (const u of users) {
  insertUser.run(...u);
}

// Get user IDs
const sarah = db.prepare("SELECT id FROM users WHERE email = ?").get("sarah@velnyx.com") as any;
const marcus = db.prepare("SELECT id FROM users WHERE email = ?").get("marcus@velnyx.com") as any;
const priya = db.prepare("SELECT id FROM users WHERE email = ?").get("priya@velnyx.com") as any;
const alex = db.prepare("SELECT id FROM users WHERE email = ?").get("alex@velnyx.com") as any;
const jordan = db.prepare("SELECT id FROM users WHERE email = ?").get("jordan@velnyx.com") as any;
const buyer = db.prepare("SELECT id FROM users WHERE email = ?").get("demo@velnyx.com") as any;

const insertAgent = db.prepare(`
  INSERT INTO agents (seller_id, name, slug, tagline, description, category, icon, price_cents, system_prompt, example_input, tags, rating_avg, rating_count, tasks_completed, total_earned_cents)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const agentsData = [
  {
    seller: sarah.id, name: "BlogForge", slug: "blogforge",
    tagline: "SEO blog posts that rank and convert",
    description: "BlogForge is your AI content strategist that produces complete, SEO-optimized blog posts. Just provide a topic, keyword, or brief and get a publication-ready article with compelling headlines, structured sections, internal linking suggestions, and conversion-focused conclusions.",
    category: "writing", icon: "✍️", price: 299,
    prompt: "You are BlogForge, an expert content strategist and SEO writer. When given a topic, keyword, or brief, produce a complete 700-900 word blog post. Include: a compelling H1 title with the primary keyword, an engaging opening hook (question, statistic, or bold claim), 3-4 H2 sections with natural keyword integration, actionable takeaways, internal linking suggestions marked as [INTERNAL LINK: topic], and a conversion-focused conclusion with CTA. Write in a conversational yet authoritative tone. Use short paragraphs (2-3 sentences max). Output in clean markdown.",
    example: "Write a blog post about 'how to hire AI agents for your business' targeting small business owners",
    tags: "seo, blog, content, writing, articles", rating: 4.9, reviews: 127, tasks: 342, earned: 102258
  },
  {
    seller: alex.id, name: "ColdMailer", slug: "coldmailer",
    tagline: "Cold emails that actually get replies",
    description: "ColdMailer crafts personalized cold outreach emails with a proven 40% reply rate methodology. Get three distinct email variants — Professional, Friendly, and Bold — each under 125 words with subject lines, personalized openers, and soft CTAs.",
    category: "writing", icon: "📧", price: 199,
    prompt: "You are ColdMailer, a cold outreach specialist with a 40% reply rate track record. Given context about who is sending the email, who they're emailing, and what they want, produce 3 distinct email variants: (1) 'The Professional' — formal, value-first, (2) 'The Friendly' — casual, relationship-first, (3) 'The Bold' — pattern-interrupting, curiosity-driven. Each email MUST be under 125 words. Include: subject line (under 6 words), personalized opening line, value prop in 1-2 sentences, soft CTA (question, not demand), and P.S. line. Also provide send timing recommendations.",
    example: "I'm a SaaS founder reaching out to marketing directors at mid-size e-commerce companies to offer our AI-powered email automation tool",
    tags: "email, outreach, cold email, sales, b2b", rating: 4.7, reviews: 89, tasks: 256, earned: 50944
  },
  {
    seller: sarah.id, name: "CodeAuditor", slug: "codeauditor",
    tagline: "Senior-level code reviews in seconds",
    description: "CodeAuditor provides principal-engineer-level code reviews covering security vulnerabilities, performance bottlenecks, error handling gaps, and readability issues. Get severity-rated findings with exact fixes and an overall code grade.",
    category: "development", icon: "🔍", price: 149,
    prompt: "You are CodeAuditor, a principal engineer with 20 years across startups and FAANG. Review the submitted code thoroughly. For each issue found, provide: severity (🔴 CRITICAL / 🟡 WARNING / 🟢 SUGGESTION / 💡 NITPICK), the exact code snippet, what's wrong, and the fix with corrected code. Also cover: security vulnerabilities, performance bottlenecks, error handling gaps, naming/readability issues, and missing edge cases. End with: Overall Grade (A-F), a 2-sentence summary, and the single most important thing to fix first.",
    example: "Review this Express.js authentication middleware for security issues",
    tags: "code review, bugs, security, performance, refactoring", rating: 4.8, reviews: 203, tasks: 567, earned: 84483
  },
  {
    seller: sarah.id, name: "APIForge", slug: "apiforge",
    tagline: "Design production-ready APIs from plain English",
    description: "APIForge transforms plain English application descriptions into complete REST API design documents. Get resource overviews, endpoint specifications, authentication strategies, pagination approaches, and ready-to-use curl examples.",
    category: "development", icon: "🏗️", price: 399,
    prompt: "You are APIForge, a backend architect who has designed APIs serving millions of requests. Given a plain English description of an application, produce a complete REST API design document including: Resource overview, Endpoint specification (method, path, description, request body, response schema with example JSON, status codes), Authentication strategy, Pagination approach, Error response format, Rate limiting recommendations, and a Quick Start section showing 3 curl examples. Use OpenAPI-style formatting. Be opinionated.",
    example: "Design an API for a pet adoption platform where shelters list animals and adopters can browse, apply, and track their applications",
    tags: "api, rest, backend, architecture, endpoints", rating: 4.9, reviews: 76, tasks: 198, earned: 79002
  },
  {
    seller: jordan.id, name: "BrandSpark", slug: "brandspark",
    tagline: "Complete brand identity from a single idea",
    description: "BrandSpark generates comprehensive brand identity packages including name options, taglines, brand voice guidelines, color palettes with hex codes, typography pairings, and visual direction — all from a single business concept.",
    category: "design", icon: "✨", price: 499,
    prompt: "You are BrandSpark, an award-winning brand strategist. Given a business concept, produce: (1) 5 Brand Name Options with rationale, domain availability assessment, and phonetic analysis, (2) Tagline for each name (under 6 words), (3) Brand Voice — 3 adjectives + a 'We are X, not Y' statement + sample caption, (4) Color Palette — primary, secondary, accent with hex codes + reasoning, (5) Typography Pairing — specific Google Fonts recommendation, (6) Visual Direction — describe the look/feel, reference real brands as benchmarks. Be creative and unexpected.",
    example: "A sustainable fashion marketplace for Gen Z that makes eco-friendly clothing feel cool, not boring",
    tags: "branding, naming, identity, creative, design", rating: 4.8, reviews: 94, tasks: 231, earned: 115269
  },
  {
    seller: jordan.id, name: "UXRoast", slug: "uxroast",
    tagline: "Brutally honest UI feedback that improves",
    description: "UXRoast delivers sharp, constructive UI/UX reviews with ranked problems, scores across layout, visual design, and usability, plus a priority action plan. Direct, witty feedback that actually helps you ship better products.",
    category: "design", icon: "🔥", price: 249,
    prompt: "You are UXRoast, a design critic known for sharp, honest UI/UX reviews. Given a description of a UI/website/app, provide: 🔴 TOP 5 PROBLEMS ranked by user impact (each with: what's wrong, why it hurts UX, and the specific fix), 🟢 3 THINGS THAT WORK, 📐 LAYOUT SCORE (1-10), 🎨 VISUAL SCORE (1-10), 🧭 USABILITY SCORE (1-10), and a PRIORITY ACTION PLAN. Be direct and witty but constructive. End with one unexpected suggestion.",
    example: "Review the UX of a SaaS dashboard that has a sidebar nav, data tables, and chart widgets. The main complaint is users can't find key features.",
    tags: "ui, ux, design review, feedback, critique", rating: 4.6, reviews: 67, tasks: 178, earned: 44322
  },
  {
    seller: priya.id, name: "DataNarrator", slug: "datanarrator",
    tagline: "Turn raw data into executive insights",
    description: "DataNarrator transforms raw data and statistics into executive-ready insight reports. Get key findings with evidence, visualization recommendations, red flags, and actionable next steps — all written for non-technical audiences.",
    category: "data", icon: "📊", price: 349,
    prompt: "You are DataNarrator, a senior data analyst who translates numbers into decisions. Given raw data or statistics, produce: EXECUTIVE SUMMARY (3 sentences), KEY INSIGHTS (5 numbered findings with evidence, business implication, and recommended action), VISUALIZATION RECOMMENDATIONS (chart type for each insight), RED FLAGS (anything concerning), and NEXT STEPS (3 actionable items with owners and timelines). Write for a non-technical audience.",
    example: "Our Q4 numbers: Revenue $2.1M (up 15% QoQ), 3,200 new users (down 8%), churn rate 4.2% (up from 3.1%), NPS score 72, support tickets up 23%, average deal size $4,500 (up 12%)",
    tags: "data, analytics, insights, reporting, business intelligence", rating: 4.7, reviews: 58, tasks: 156, earned: 54444
  },
  {
    seller: priya.id, name: "SQLGenius", slug: "sqlgenius",
    tagline: "Plain English to production SQL",
    description: "SQLGenius converts plain English questions into optimized PostgreSQL queries with clear comments, performance notes, indexing suggestions, edge case handling, and alternative approaches.",
    category: "data", icon: "🧙", price: 199,
    prompt: "You are SQLGenius, a database expert. Convert plain English questions into optimized PostgreSQL queries. Provide: (1) SQL query with clear comments, (2) Plain English explanation, (3) Performance notes and indexing suggestions, (4) Edge cases and assumptions, (5) Alternative approach with tradeoff notes. Always use best practices.",
    example: "Find the top 10 customers by total order value in the last 90 days, including their most frequently purchased product category",
    tags: "sql, database, queries, postgresql, data", rating: 4.8, reviews: 112, tasks: 389, earned: 77411
  },
  {
    seller: marcus.id, name: "AdCopyEngine", slug: "adcopyengine",
    tagline: "High-converting ads for every platform",
    description: "AdCopyEngine generates ready-to-launch ad copy for Google Ads, Meta/Instagram, LinkedIn, and TikTok. Get multiple variants with psychological triggers, funnel targeting, and A/B testing suggestions from a $50M+ ad spend veteran.",
    category: "marketing", icon: "📢", price: 299,
    prompt: "You are AdCopyEngine, a performance marketer who has managed $50M+ in ad spend. Given a product/service description and target audience, produce ready-to-launch ad copy for: GOOGLE ADS (3 responsive search ad sets with 5 headlines ≤30 chars and 3 descriptions ≤90 chars), META/INSTAGRAM (3 variants with primary text, headline, description, CTA), LINKEDIN (2 B2B variants), and TIKTOK (3 hook scripts). For each variant note: psychological trigger used, target funnel stage, and A/B testing suggestion.",
    example: "Product: AI-powered project management tool for remote teams. Target: Engineering managers at companies with 50-500 employees. USP: Reduces meeting time by 40%",
    tags: "ads, copywriting, google ads, meta ads, marketing", rating: 4.7, reviews: 83, tasks: 267, earned: 79833
  },
  {
    seller: marcus.id, name: "ViralHooks", slug: "viralhooks",
    tagline: "Scroll-stopping hooks for any platform",
    description: "ViralHooks generates scroll-stopping content hooks across all major platforms. Get rated video hooks, Twitter thread openers, LinkedIn openers, and YouTube thumbnail + title combos with psychological principles explained.",
    category: "marketing", icon: "🎣", price: 99,
    prompt: "You are ViralHooks, a social media growth strategist with 500M+ organic impressions. Given a topic or product, generate: 10 SHORT-FORM VIDEO HOOKS (≤10 words, rate each 1-5🔥), 5 TWITTER/X THREAD OPENERS, 5 LINKEDIN OPENERS, 3 YOUTUBE THUMBNAIL + TITLE COMBOS (title ≤60 chars + thumbnail text ≤5 words). For each hook, note which psychological principle it uses.",
    example: "Topic: Why most startups fail in the first year — target audience is aspiring entrepreneurs",
    tags: "social media, hooks, viral, content, growth", rating: 4.5, reviews: 145, tasks: 512, earned: 50688
  },
  {
    seller: alex.id, name: "DeepResearch", slug: "deepresearch",
    tagline: "McKinsey-quality research briefs",
    description: "DeepResearch produces McKinsey-quality research briefs with executive summaries, key findings, stakeholder analysis, competitive landscape mapping, and prioritized recommendations. Clear confidence levels distinguish facts from estimates.",
    category: "research", icon: "🔬", price: 399,
    prompt: "You are DeepResearch, a research analyst who produces McKinsey-quality briefs. Given a research question, produce: EXECUTIVE SUMMARY (100 words), BACKGROUND & CONTEXT, KEY FINDINGS (5-7 with supporting reasoning), STAKEHOLDER ANALYSIS, OPPORTUNITIES & RISKS, COMPETITIVE LANDSCAPE, RECOMMENDATIONS (3 prioritized actions), and SOURCES TO EXPLORE. Distinguish between facts, estimates, and opinions. Flag confidence levels.",
    example: "Research the current state of AI agents marketplace — who are the key players, what business models work, and where are the opportunities for new entrants?",
    tags: "research, analysis, strategy, consulting, briefs", rating: 4.9, reviews: 61, tasks: 143, earned: 57057
  },
];

for (const a of agentsData) {
  insertAgent.run(
    a.seller, a.name, a.slug, a.tagline, a.description, a.category, a.icon,
    a.price, a.prompt, a.example, a.tags, a.rating, a.reviews, a.tasks, a.earned
  );
}

// Get agent IDs
const getAgentId = (slug: string) => (db.prepare("SELECT id FROM agents WHERE slug = ?").get(slug) as any).id;

// Seed reviews
const insertReview = db.prepare(`
  INSERT INTO reviews (task_id, agent_id, buyer_id, rating, comment, created_at)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const insertTask = db.prepare(`
  INSERT INTO tasks (agent_id, buyer_id, input_text, output_text, status, price_cents, created_at, completed_at)
  VALUES (?, ?, ?, ?, 'completed', ?, ?, ?)
`);

const reviewerNames = [
  "Emma Thompson", "James Rodriguez", "Lisa Chang", "David Park", "Nina Kowalski",
  "Ryan Mitchell", "Sophia Ahmed", "Tyler Brooks", "Maya Singh", "Chris O'Brien",
  "Olivia Foster", "Daniel Lee", "Rachel Green", "Mark Wilson", "Aisha Johnson"
];

const reviewComments: Record<string, string[]> = {
  blogforge: [
    "BlogForge produced an incredibly well-structured article with perfect keyword placement. My traffic increased 40% after publishing.",
    "The SEO optimization is spot on. Love how it naturally weaves in keywords without sounding robotic.",
    "Great content but could be a bit more creative with the hooks. Still, way better than writing from scratch.",
    "This agent saved me 3 hours of writing. The internal linking suggestions were a brilliant touch.",
    "Phenomenal quality. I've used it for 12 blog posts now and each one has ranked on page 1."
  ],
  coldmailer: [
    "The Bold variant got me a 45% reply rate. Absolutely insane for cold outreach.",
    "Love the three variants approach — gives me options to A/B test. The timing recommendations were spot on.",
    "Good emails but the personalization could go deeper. Still saves me tons of time.",
    "My sales team now uses ColdMailer for every campaign. Response rates tripled."
  ],
  codeauditor: [
    "Found a critical SQL injection vulnerability I completely missed. This agent literally saved our production database.",
    "The severity ratings make it easy to prioritize fixes. Excellent code review quality.",
    "Like having a senior engineer review my code 24/7. The suggestions are always practical.",
    "Caught performance issues in my React components that would have caused problems at scale.",
    "The overall grade and priority recommendations make this invaluable for code quality."
  ],
  apiforge: [
    "Turned my vague app idea into a production-ready API spec in under a minute. Incredible.",
    "The curl examples saved me so much time getting started with implementation.",
    "Very thorough API design. The pagination and error handling recommendations were excellent."
  ],
  brandspark: [
    "Got a complete brand identity that my designer said would have cost $5,000+ from an agency.",
    "The name options were creative and memorable. We went with option 3 and love it.",
    "Color palette and typography recommendations were professional-grade. Highly recommend.",
    "BrandSpark understood our target market perfectly. The brand voice section was particularly useful."
  ],
  uxroast: [
    "Brutal but fair. Every piece of feedback was actionable and our conversion rate improved 25%.",
    "The scoring system makes it easy to track improvements over iterations.",
    "Wish I'd used UXRoast before launch. Would have caught several usability issues."
  ],
  datanarrator: [
    "Turned our raw Q4 data into an executive presentation in seconds. CEO was impressed.",
    "The visualization recommendations were perfect — exactly the charts I needed.",
    "Red flags section caught a concerning churn trend we had overlooked."
  ],
  sqlgenius: [
    "Converted 20 business questions to optimized SQL in one afternoon. Game changer.",
    "The performance notes and indexing suggestions helped optimize our slowest queries.",
    "Alternative approaches with tradeoff notes are incredibly valuable for learning.",
    "Handles complex joins and subqueries perfectly. Even suggests CTEs when appropriate."
  ],
  adcopyengine: [
    "Generated a month's worth of ad copy across all platforms in 10 minutes.",
    "The psychological triggers annotations help me understand WHY the copy works.",
    "Our Google Ads CTR improved 60% using AdCopyEngine's headlines.",
    "Multi-platform support is the killer feature. Consistent messaging across channels."
  ],
  viralhooks: [
    "3 of the hooks went viral on TikTok. 2M+ views combined. Worth every penny.",
    "The psychological principles breakdown helped me write my own hooks too.",
    "Quick, creative, and effective. Use it weekly for content planning.",
    "YouTube title suggestions increased our click-through rate by 35%.",
    "Best $0.99 I've spent. The hooks are genuinely scroll-stopping."
  ],
  deepresearch: [
    "McKinsey-quality is not an exaggeration. This replaced a $10K consulting engagement.",
    "The confidence level flags are a brilliant touch — I know exactly what to verify.",
    "Thorough, well-structured, and actionable. My go-to for market research."
  ],
};

const now = new Date();
let taskId = 1;

for (const a of agentsData) {
  const agentId = getAgentId(a.slug);
  const comments = reviewComments[a.slug] || [];

  for (let i = 0; i < comments.length; i++) {
    const hoursAgo = Math.floor(Math.random() * 720) + 1; // within last 30 days
    const taskDate = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    const dateStr = taskDate.toISOString().replace("T", " ").split(".")[0];

    const rating = i === 2 && a.rating < 4.8 ? 4 : Math.random() > 0.2 ? 5 : 4;

    insertTask.run(
      agentId, buyer.id,
      `Sample task input for ${a.name}`,
      `Sample completed output from ${a.name}`,
      a.price, dateStr, dateStr
    );

    insertReview.run(taskId, agentId, buyer.id, rating, comments[i], dateStr);
    taskId++;
  }
}

// Seed additional completed tasks (without reviews)
const additionalTasks = [
  { slug: "blogforge", input: "Write a blog post about remote work productivity tips" },
  { slug: "codeauditor", input: "Review this Python Flask API for security issues" },
  { slug: "viralhooks", input: "Generate hooks for a new fitness app launch" },
  { slug: "sqlgenius", input: "Query to find inactive users who haven't logged in for 30 days" },
  { slug: "brandspark", input: "Brand identity for a pet wellness subscription box" },
];

for (const t of additionalTasks) {
  const agentId = getAgentId(t.slug);
  const agent = agentsData.find((a) => a.slug === t.slug)!;
  const hoursAgo = Math.floor(Math.random() * 48) + 1;
  const taskDate = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
  const dateStr = taskDate.toISOString().replace("T", " ").split(".")[0];

  insertTask.run(
    agentId, buyer.id, t.input,
    `Completed output for: ${t.input}`,
    agent.price, dateStr, dateStr
  );
  taskId++;
}

// Seed activity
const insertActivity = db.prepare(
  "INSERT INTO activity (type, agent_id, user_id, metadata, created_at) VALUES (?, ?, ?, ?, ?)"
);

const activities = [
  { type: "task_completed", slug: "blogforge", meta: '{"agent_name":"BlogForge"}', minsAgo: 2 },
  { type: "review", slug: "codeauditor", meta: '{"agent_name":"CodeAuditor","rating":5}', minsAgo: 5 },
  { type: "new_agent", slug: "datanarrator", meta: '{"agent_name":"DataNarrator"}', minsAgo: 12 },
  { type: "task_completed", slug: "viralhooks", meta: '{"agent_name":"ViralHooks"}', minsAgo: 18 },
  { type: "review", slug: "brandspark", meta: '{"agent_name":"BrandSpark","rating":5}', minsAgo: 25 },
  { type: "task_completed", slug: "adcopyengine", meta: '{"agent_name":"AdCopyEngine"}', minsAgo: 33 },
  { type: "task_completed", slug: "sqlgenius", meta: '{"agent_name":"SQLGenius"}', minsAgo: 41 },
  { type: "review", slug: "apiforge", meta: '{"agent_name":"APIForge","rating":4}', minsAgo: 55 },
  { type: "task_completed", slug: "deepresearch", meta: '{"agent_name":"DeepResearch"}', minsAgo: 67 },
  { type: "new_agent", slug: "coldmailer", meta: '{"agent_name":"ColdMailer"}', minsAgo: 80 },
  { type: "task_completed", slug: "uxroast", meta: '{"agent_name":"UXRoast"}', minsAgo: 95 },
  { type: "review", slug: "blogforge", meta: '{"agent_name":"BlogForge","rating":5}', minsAgo: 110 },
  { type: "task_completed", slug: "codeauditor", meta: '{"agent_name":"CodeAuditor"}', minsAgo: 130 },
  { type: "task_completed", slug: "brandspark", meta: '{"agent_name":"BrandSpark"}', minsAgo: 150 },
  { type: "review", slug: "viralhooks", meta: '{"agent_name":"ViralHooks","rating":5}', minsAgo: 180 },
  { type: "task_completed", slug: "datanarrator", meta: '{"agent_name":"DataNarrator"}', minsAgo: 240 },
  { type: "task_completed", slug: "adcopyengine", meta: '{"agent_name":"AdCopyEngine"}', minsAgo: 360 },
  { type: "review", slug: "sqlgenius", meta: '{"agent_name":"SQLGenius","rating":5}', minsAgo: 480 },
  { type: "task_completed", slug: "blogforge", meta: '{"agent_name":"BlogForge"}', minsAgo: 720 },
  { type: "task_completed", slug: "deepresearch", meta: '{"agent_name":"DeepResearch"}', minsAgo: 1200 },
];

for (const act of activities) {
  const agentId = getAgentId(act.slug);
  const actDate = new Date(now.getTime() - act.minsAgo * 60 * 1000);
  const dateStr = actDate.toISOString().replace("T", " ").split(".")[0];
  insertActivity.run(act.type, agentId, buyer.id, act.meta, dateStr);
}

console.log("✅ Database seeded successfully!");
console.log("   6 users, 11 agents, reviews, tasks, and activity feed created.");
console.log("   Demo login: demo@velnyx.com / demo1234");

db.close();
