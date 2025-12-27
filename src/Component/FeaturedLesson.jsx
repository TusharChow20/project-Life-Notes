"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import instance from "@/app/AxiosApi/AxiosInstence";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Eye,
  Star,
  ArrowRight,
  Loader2,
  BookmarkPlus,
} from "lucide-react";

export function FeaturedLessons() {
  const [showAll, setShowAll] = useState(false);

  // Fetch featured lessons
  const {
    data: featuredLessons = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["featuredLessons"],
    queryFn: async () => {
      const res = await instance.get("/featured-lessons");
      return res.data;
    },
  });

  if (error || featuredLessons.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-green-400 animate-spin" />
        </div>
      </section>
    );
  }

  const displayedLessons = showAll
    ? featuredLessons
    : featuredLessons.slice(0, 6);

  const hasMore = featuredLessons.length > 6;

  if (featuredLessons.length === 0) {
    return null;
  }

  return (
    <section id="featured-lesson" className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
          <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
          Featured Life Lessons
        </h2>
        <p className="text-green-300 mt-2 max-w-xl">
          Hand-picked lessons curated by our team to inspire growth and
          transformation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedLessons.map((lesson) => (
          <Link
            key={lesson._id}
            href={`/public-lessons/${lesson._id}`}
            className="group border border-green-400/20 rounded-2xl overflow-hidden hover:border-green-400 hover:shadow-xl hover:shadow-green-400/20 transition-all duration-300"
          >
            {/* Image */}
            {lesson.image && (
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src={lesson.image}
                  alt={lesson.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Featured
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-3">
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
                  <div className="flex items-center gap-1 text-blue-400">
                    <BookmarkPlus className="w-4 h-4" />
                    <span>{lesson.favoritesCount || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Button */}
      {hasMore && !showAll && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setShowAll(true)}
            className="group px-8 cursor-pointer py-4 bg-linear-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition transform hover:scale-105 flex items-center gap-2"
          >
            View All {featuredLessons.length} Featured Lessons
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </button>
        </div>
      )}

      {/* Show Less Button */}
      {showAll && hasMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setShowAll(false)}
            className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition"
          >
            Show Less
          </button>
        </div>
      )}
    </section>
  );
}
