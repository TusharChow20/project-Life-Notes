import { TrendingUp, Lightbulb, Users, Brain } from "lucide-react";

export function WhyLearningMatters() {
  const benefits = [
    {
      icon: "🧠",
      title: "Enhanced Self-Awareness",
      description:
        "Reflect on your experiences to gain deeper insights into your thoughts, behaviors, and patterns.",
      color: "from-purple-500 to-pink-500",
      iconComponent: Brain,
    },
    {
      icon: "📈",
      title: "Accelerated Personal Growth",
      description:
        "Transform mistakes into stepping stones and achievements into momentum for continuous improvement.",
      color: "from-blue-500 to-cyan-500",
      iconComponent: TrendingUp,
    },
    {
      icon: "💡",
      title: "Wisdom Through Experience",
      description:
        "Convert everyday moments into valuable lessons that shape your decision-making and perspective.",
      color: "from-yellow-500 to-orange-500",
      iconComponent: Lightbulb,
    },
    {
      icon: "👥",
      title: "Community Learning",
      description:
        "Learn from others' journeys and contribute your wisdom to help fellow learners grow.",
      color: "from-green-500 to-emerald-500",
      iconComponent: Users,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 ">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Why Learning From Life Matters
        </h2>
        <p className="text-green-300 max-w-2xl mx-auto">
          Every experience holds a lesson. Discover how documenting and
          reflecting on life&apos;s moments can transform your journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((benefit, index) => {
          const IconComponent = benefit.iconComponent;
          return (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-green-400/20 rounded-2xl p-6 hover:border-green-400 hover:shadow-xl hover:shadow-green-400/20 transition-all duration-300"
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <IconComponent className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-green-400 transition">
                {benefit.title}
              </h3>
              <p className="text-sm text-green-300 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
