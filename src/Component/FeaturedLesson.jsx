export function FeaturedLessons({ lessons = [] }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white">
          🌟 Featured Life Lessons
        </h2>
        <p className="text-green-300 mt-2 max-w-xl">
          Hand-picked lessons curated by our team to inspire growth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="border border-green-400/20 rounded-2xl p-6 hover:border-green-400 transition"
          >
            <h3 className="text-xl font-semibold text-white mb-2">
              {lesson.title}
            </h3>

            <p className="text-sm text-green-300 line-clamp-3">
              {lesson.summary}
            </p>

            <div className="flex justify-between items-center mt-6 text-sm text-green-400">
              <span>By {lesson.author}</span>
              <span>❤️ {lesson.saves}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
