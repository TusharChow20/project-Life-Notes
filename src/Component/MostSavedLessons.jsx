
"use client";

import { useState } from "react";
import {
  Heart,
  BookmarkPlus,
  TrendingUp,
  Loader2,
  Eye,
} from "lucide-react";

export function MostSavedLessons() {
  const [savedLessons, setSavedLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useState(() => {
    setTimeout(() => {
      const mockData = [
        {
          _id: "1",
          title: "Finding Strength in Vulnerability",
          description:
            "How opening up about struggles led to deeper connections and unexpected support from others.",
          category: "Personal Growth",
          emotionalTone: "Inspirational",
          image: null,
          creatorName: "Sarah J.",
          likesCount: 234,
          favoritesCount: 189,
        },
        {
          _id: "2",
          title: "The Power of Saying No",
          description:
            "Learning to set boundaries transformed my relationships and mental health for the better.",
          category: "Self-Care",
          emotionalTone: "Empowering",
          image: null,
          creatorName: "Michael C.",
          likesCount: 198,
          favoritesCount: 167,
        },
        {
          _id: "3",
          title: "Embracing Failure as Feedback",
          description:
            "My biggest business failure became the catalyst for my greatest success.",
          category: "Career",
          emotionalTone: "Reflective",
          image: null,
          creatorName: "Emma D.",
          likesCount: 176,
          favoritesCount: 156,
        },
        {
          _id: "4",
          title: "Gratitude Changed Everything",
          description:
            "A simple daily practice shifted my entire perspective on life and happiness.",
          category: "Mindfulness",
          emotionalTone: "Uplifting",
          image: null,
          creatorName: "James W.",
          likesCount: 167,
          favoritesCount: 142,
        },
        {
          _id: "5",
          title: "Listening More, Speaking Less",
          description:
            "How silence became my greatest teacher in understanding others.",
          category: "Relationships",
          emotionalTone: "Thoughtful",
          image: null,
          creatorName: "Olivia B.",
          likesCount: 145,
          favoritesCount: 128,
        },
        {
          _id: "6",
          title: "Starting Before You're Ready",
          description:
            "Waiting for the perfect moment was holding me back from my dreams.",
          category: "Motivation",
          emotionalTone: "Encouraging",
          image: null,
          creatorName: "David M.",
          likesCount: 134,
          favoritesCount: 118,
        },
      ];
      setSavedLessons(mockData);
      setIsLoading(false);
    }, 600);
  }, []);

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-green-400 animate-spin" />
        </div>
      </section>
    );
  }

  if (error || savedLessons.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 bg-gradient-to-b from-transparent via-green-900/5 to-transparent">
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
          <BookmarkPlus className="w-8 h-8 text-blue-400" />
          Most Saved Lessons
        </h2>
        <p className="text-green-300 mt-2 max-w-xl">
          Lessons that resonated most with our community. Discover what others
          find valuable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {savedLessons.slice(0, 6).map((lesson, index) => (
          <div
            key={lesson._id}
            className="group relative border border-green-400/20 rounded-2xl overflow-hidden hover:border-green-400 hover:shadow-xl hover:shadow-green-400/20 transition-all duration-300 cursor-pointer"
          >
            {/* Trending Badge */}
            {index < 3 && (
              <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Trending
              </div>
            )}

            {/* Placeholder Image */}
            <div className="relative w-full h-48 bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center">
              <div className="text-6xl">
                {index % 3 === 0 ? "🌱" : index % 3 === 1 ? "💭" : "✨"}
              </div>
            </div>

            <div className="p-6">
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
                    <Heart className="w-4 h-4" />
                    <span>{lesson.likesCount || 0}</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-400 font-bold">
                    <BookmarkPlus className="w-4 h-4" />
                    <span>{lesson.favoritesCount || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <button className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition transform hover:scale-105 flex items-center gap-2">
          Explore All Lessons
          <Eye className="w-5 h-5 group-hover:translate-x-1 transition" />
        </button>
      </div>
    </section>
  );
}