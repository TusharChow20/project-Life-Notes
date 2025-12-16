export function WhyLifeMatters() {
  const benefits = [
    {
      title: "Real Experiences",
      desc: "Lessons born from real life have deeper meaning and impact.",
    },
    {
      title: "Personal Growth",
      desc: "Reflecting on life helps you evolve emotionally and mentally.",
    },
    {
      title: "Better Decisions",
      desc: "Past lessons guide smarter choices in the future.",
    },
    {
      title: "Shared Wisdom",
      desc: "Your experiences can inspire and help others grow.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-3xl font-bold text-white mb-12">
        Why Learning From Life Matters
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {benefits.map((item, index) => (
          <div
            key={index}
            className="border border-green-400/20 rounded-2xl p-6 hover:border-green-400 transition"
          >
            <h3 className="text-lg font-semibold text-white mb-3">
              {item.title}
            </h3>
            <p className="text-sm text-green-300">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
