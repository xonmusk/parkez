import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] mt-32">
      <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <Link href="/" className="font-clash text-2xl font-semibold text-white">
              Velnyx<span className="text-accent">.</span>
            </Link>
            <p className="text-zinc-500 text-sm mt-3 leading-relaxed">
              The marketplace for AI agents. Discover, hire, and deploy
              intelligent agents built by the best creators.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.05em] text-zinc-400 font-medium mb-4">
              Marketplace
            </h4>
            <div className="space-y-3">
              <Link href="/agents" className="block text-sm text-zinc-500 hover:text-white transition-colors">
                Browse Agents
              </Link>
              <Link href="/agents?category=writing" className="block text-sm text-zinc-500 hover:text-white transition-colors">
                Writing & Content
              </Link>
              <Link href="/agents?category=development" className="block text-sm text-zinc-500 hover:text-white transition-colors">
                Development & Code
              </Link>
              <Link href="/agents?category=design" className="block text-sm text-zinc-500 hover:text-white transition-colors">
                Design & Creative
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.05em] text-zinc-400 font-medium mb-4">
              For Creators
            </h4>
            <div className="space-y-3">
              <Link href="/register" className="block text-sm text-zinc-500 hover:text-white transition-colors">
                Become a Seller
              </Link>
              <Link href="/dashboard/seller" className="block text-sm text-zinc-500 hover:text-white transition-colors">
                Seller Dashboard
              </Link>
              <Link href="/dashboard/seller/agents/new" className="block text-sm text-zinc-500 hover:text-white transition-colors">
                Create an Agent
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.05em] text-zinc-400 font-medium mb-4">
              Company
            </h4>
            <div className="space-y-3">
              <span className="block text-sm text-zinc-500">About</span>
              <span className="block text-sm text-zinc-500">Blog</span>
              <span className="block text-sm text-zinc-500">Privacy</span>
              <span className="block text-sm text-zinc-500">Terms</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.06] mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            © 2025 Velnyx. All rights reserved.
          </p>
          <p className="text-xs text-zinc-600">
            Powered by AI agents on Claude
          </p>
        </div>
      </div>
    </footer>
  );
}
