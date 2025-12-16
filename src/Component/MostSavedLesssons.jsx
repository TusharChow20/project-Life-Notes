export function MostSavedLessons({ lessons = [] }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-3xl font-bold text-white mb-10">
        ❤️ Most Saved Lessons
      </h2>

      <div className="space-y-6">
        {lessons.map((lesson, index) => (
          <div
            key={lesson.id}
            className="border border-green-400/20 rounded-2xl p-6 flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold text-white">
                {index + 1}. {lesson.title}
              </h3>
              <p className="text-sm text-green-300">By {lesson.author}</p>
            </div>

            <span className="text-green-400 font-semibold">
              ❤️ {lesson.saves || '0'}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
