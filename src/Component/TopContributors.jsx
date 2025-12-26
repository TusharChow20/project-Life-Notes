"use client";

import { useQuery } from "@tanstack/react-query";
import instance from "@/app/AxiosApi/AxiosInstence";
import { Crown, Star, Target, Award, Loader2 } from "lucide-react";

export function TopContributors() {
  const {
    data: contributors = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["topContributors"],
    queryFn: async () => {
      const res = await instance.get("/top-contributors?limit=3");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-green-400 animate-spin" />
        </div>
      </section>
    );
  }

  if (error || contributors.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
          <Crown className="w-8 h-8 text-yellow-400 fill-yellow-400" />
          Top Contributors of the Week
        </h2>
        <p className="text-green-300 mt-2 max-w-xl">
          Celebrating our community members who inspire others with their wisdom
          and insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contributors.map((contributor, index) => (
          <div
            key={contributor._id}
            className="relative group  backdrop-blur-sm border border-green-400/20 rounded-2xl p-6 hover:border-green-400 hover:shadow-xl hover:shadow-green-400/20 transition-all duration-300"
          >
            {/* Rank Badge */}
            {index < 3 && (
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                #{index + 1}
              </div>
            )}

            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xl font-bold ring-2 ring-green-400/50">
                  {contributor.creatorName?.charAt(0) || "?"}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition">
                  {contributor.creatorName || "Anonymous"}
                </h3>
                <p className="text-sm text-green-300 mb-3">
                  {contributor.creatorEmail}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-blue-400">
                    <Target className="w-4 h-4" />
                    <span className="font-medium">
                      {contributor.lessonsCount}
                    </span>
                    <span className="text-gray-400">lessons</span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-medium">
                      {contributor.totalLikes}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-gray-400">
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
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    ></path>
                  </svg>
                  <span>{contributor.totalFavorites} saves</span>
                </div>
              </div>
              <span className="text-xs text-green-400 font-medium flex items-center gap-1">
                <Award className="w-4 h-4" />
                Top Creator
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
