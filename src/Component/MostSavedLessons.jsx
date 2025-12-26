"use client";
import instance from "@/app/AxiosApi/AxiosInstence";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function MostSavedLessons() {
  const {
    data: savedLessonsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["mostSavedLessons"],
    queryFn: async () => {
      const res = await instance.get("/publicLesson?sortBy=mostSaved&limit=3");
      return res.data;
    },
  });

  const savedLessons = savedLessonsData?.lessons || [];
  console.log("MostSavedLessons API:", savedLessonsData);

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-green-400 animate-spin" />
        </div>
      </section>
    );
  }
  if (savedLessons.length === 0) {
    return (
      <section className="text-white text-center py-20">
        No lessons found
      </section>
    );
  }

  if (error) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 bg-gradient-to-b from-transparent via-green-900/5 to-transparent">
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
          Most Saved Lessons
        </h2>
        <p className="text-green-300 mt-2 max-w-xl">
          Lessons that resonated most with our community. Discover what others
          find valuable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {savedLessons.map((lesson, index) => (
          <a
            key={lesson._id}
            href={`/public-lessons/${lesson._id}`}
            className="group relative border border-green-400/20 rounded-2xl overflow-hidden hover:border-green-400 hover:shadow-xl hover:shadow-green-400/20 transition-all duration-300"
          >
            {index < 3 && (
              <div className="absolute top-3 left-3 z-10 bg-linear-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  ></path>
                </svg>
                Trending
              </div>
            )}

            {lesson.image ? (
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  width={500}
                  height={100}
                  src={lesson.image}
                  alt={lesson.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="relative w-full h-48 bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center">
                <div className="text-6xl">
                  {index % 3 === 0 ? "🌱" : index % 3 === 1 ? "💭" : "✨"}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold">
                  {lesson.category}
                </span>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold">
                  {lesson.emotionalTone}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2 group-hover:text-green-400 transition">
                {lesson.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-green-300 line-clamp-3 mb-4">
                {lesson.description}
              </p>

              {/* Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <span className="text-white font-medium">
                    {lesson.creatorName}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1 text-red-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      ></path>
                    </svg>
                    <span>{lesson.likesCount || 0}</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-400 font-bold">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      ></path>
                    </svg>
                    <span>{lesson.favoritesCount || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <Link
          href="/public-lessons"
          className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition transform hover:scale-105 flex items-center gap-2"
        >
          Explore All Lessons
          <svg
            className="w-5 h-5 group-hover:translate-x-1 transition"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            ></path>
          </svg>
        </Link>
      </div>
    </section>
  );
}
