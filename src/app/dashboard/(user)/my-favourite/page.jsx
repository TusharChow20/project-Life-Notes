"use client";
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart, Info, Filter, Trash2, Book } from "lucide-react";
import instance from "@/app/AxiosApi/AxiosInstence";

export default function FavoritesManager() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTone, setSelectedTone] = useState("all");

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["favorites", session?.user?.email],
    queryFn: async () => {
      const response = await instance.get(
        `/favorites?userId=${session?.user?.email}`
      );
      return response.data.favorites || [];
    },
    enabled: !!session?.user?.email,
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async ({ favoriteId, lessonId }) => {
      const response = await instance.delete(`/favorites/${favoriteId}`, {
        data: {
          userId: session?.user?.email,
          lessonId,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["favorites", session?.user?.email]);
    },
    onError: (error) => {
      console.error("Error removing favorite:", error);
      alert("Failed to remove from favorites. Please try again.");
    },
  });

  const categories = useMemo(() => {
    return [...new Set(favorites.map((f) => f.category).filter(Boolean))];
  }, [favorites]);

  const emotionalTones = useMemo(() => {
    return [...new Set(favorites.map((f) => f.emotionalTone).filter(Boolean))];
  }, [favorites]);

  const filteredFavorites = useMemo(() => {
    let filtered = [...favorites];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((f) => f.category === selectedCategory);
    }

    if (selectedTone !== "all") {
      filtered = filtered.filter((f) => f.emotionalTone === selectedTone);
    }

    return filtered;
  }, [favorites, selectedCategory, selectedTone]);

  const removeFavorite = (lessonId, favoriteId) => {
    if (confirm("Are you sure you want to remove this from favorites?")) {
      removeFavoriteMutation.mutate({ favoriteId, lessonId });
    }
  };

  const viewLessonDetails = (lessonId) => {
    router.push(`/public-lessons/${lessonId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-green-600">Loading favorites...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-100 flex items-center gap-3 mb-2">
            <Heart className="text-red-500 fill-red-500" size={36} />
            My Favorite Lessons
          </h1>
          <p className="text-gray-200">Manage and explore your saved lessons</p>
        </div>

        {/* Filters */}
        <div className="rounded-lg shadow-md p-6 mb-6 ">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-green-600" />
            <h2 className="text-xl font-semibold text-gray-300">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2  text-gray-200 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Emotional Tone
              </label>
              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
                className="w-full px-4 py-2  text-gray-200 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Tones</option>
                {emotionalTones.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-400">
            Showing {filteredFavorites.length} of {favorites.length} lessons
          </div>
        </div>

        {/* Favorites List */}
        {filteredFavorites.length === 0 ? (
          <div className="rounded-lg shadow-md p-12 text-center">
            <Heart size={64} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-200 mb-2">
              No favorites found
            </h3>
            <p className="text-gray-300">
              {favorites.length === 0
                ? "Start adding lessons to your favorites!"
                : "Try adjusting your filters"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFavorites.map((favorite) => (
              <div
                key={favorite._id}
                className="bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-700"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <Book
                        className="text-green-600 mt-1 flex-shrink-0"
                        size={24}
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-100 mb-1">
                          {favorite.lessonTitle}
                        </h3>
                        <p className="text-gray-300 text-sm">
                          {favorite.lessonDescription}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 ml-9">
                      <span className="px-3 py-1 bg-purple-900 text-purple-200 rounded-full text-sm font-medium">
                        {favorite.category}
                      </span>
                      <span className="px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm font-medium">
                        {favorite.emotionalTone}
                      </span>
                      {favorite.duration && (
                        <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                          {favorite.duration} min
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2">
                    <button
                      onClick={() => viewLessonDetails(favorite.lessonId)}
                      className="flex-1 md:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center cursor-pointer gap-2"
                    >
                      <Info size={18} />
                      <span>Details</span>
                    </button>

                    <button
                      onClick={() =>
                        removeFavorite(favorite.lessonId, favorite._id)
                      }
                      disabled={removeFavoriteMutation.isPending}
                      className="flex-1 md:flex-none px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Trash2 size={18} />
                      <span>
                        {removeFavoriteMutation.isPending
                          ? "Removing..."
                          : "Remove"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
