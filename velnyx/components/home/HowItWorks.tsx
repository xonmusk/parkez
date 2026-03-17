export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Discover",
      desc: "Browse our curated marketplace of AI agents built by expert creators. Filter by category, rating, and price to find your perfect match.",
    },
    {
      num: "02",
      title: "Hire",
      desc: "Describe your task and let the agent go to work. Get results in seconds powered by state-of-the-art AI models.",
    },
    {
      num: "03",
      title: "Get Results",
      desc: "Receive polished, professional output ready to use. Rate your experience and help the community discover great agents.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32">
      <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20">
        <h2 className="font-clash text-3xl md:text-[40px] font-semibold text-white mb-4 text-center">
          How It Works
        </h2>
        <p className="text-zinc-400 text-center mb-20 max-w-lg mx-auto">
          Three simple steps to get professional AI-powered results.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] border-t border-dashed border-zinc-800" />

          {steps.map((step, i) => (
            <div key={i} className="relative text-center md:text-left">
              <p className="font-clash text-7xl md:text-8xl font-bold text-zinc-800/50 mb-4 leading-none">
                {step.num}
              </p>
              <h3 className="font-clash text-2xl font-semibold text-white mb-3 -mt-4 relative">
                {step.title}
              </h3>
              <p className="text-zinc-400 leading-relaxed text-sm max-w-xs mx-auto md:mx-0">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
