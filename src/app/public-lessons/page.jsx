"use client";

import { useEffect, useState } from "react";
import { Listbox } from "@headlessui/react";
import {
  Search,
  Lock,
  Calendar,
  Tag,
  Heart,
  BookmarkPlus,
  Eye,
  ChevronDown,
  ChevronRight,
  ChevronRightCircle,
  ChevronLeftCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import instance from "../AxiosApi/AxiosInstence";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
function DarkSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-white mb-2">
        {label}
      </label>

      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="w-full flex justify-between items-center px-4 py-2 rounded-lg border border-gray-600 bg-transparent text-white">
            <span>{value}</span>
            <ChevronDown className="w-4 h-4 text-gray-300" />
          </Listbox.Button>

          <Listbox.Options className="absolute z-50 mt-2 w-full rounded-lg bg-gray-900 border border-gray-700 shadow-xl overflow-hidden">
            {options.map((opt) => (
              <Listbox.Option
                key={opt}
                value={opt}
                className={({ active, selected }) =>
                  `cursor-pointer px-4 py-2 text-sm ${
                    selected
                      ? "bg-green-600 text-white"
                      : active
                      ? "bg-gray-700 text-white"
                      : "text-gray-300"
                  }`
                }
              >
                {opt}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}

const categories = [
  "All",
  "Personal Growth",
  "Career",
  "Relationships",
  "Mindset",
  "Mistakes Learned",
];
const emotionalTones = [
  "All",
  "Motivational",
  "Sad",
  "Realization",
  "Gratitude",
];

export default function PublicLessonsPage() {
  const { data: session } = useSession();
  console.log("SESSION", session);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTone, setSelectedTone] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);
  const { data, isLoading, error } = useQuery({
    queryKey: [
      "publicLesson",
      page,
      selectedCategory,
      selectedTone,
      sortBy,
      debouncedSearch,
    ],
    queryFn: async () => {
      const response = await instance.get("/publicLesson", {
        params: {
          page,
          limit: 9,
          category: selectedCategory,
          emotionalTone: selectedTone,
          sortBy,
          search: debouncedSearch,
        },
      });
      return response.data;
    },
  });

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, selectedTone, sortBy]);

  const mockLessons = data?.lessons || [];

  const isUserPremium = session?.user?.isPremium === true;

  const filteredLessons = mockLessons
    .filter((lesson) => {
      if (!lesson) return false;
      const matchesSearch =
        (lesson?.title || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (lesson?.description || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || lesson?.category === selectedCategory;
      const matchesTone =
        selectedTone === "All" || lesson?.emotionalTone === selectedTone;
      return matchesSearch && matchesCategory && matchesTone;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
      if (sortBy === "oldest")
        return new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0);
      if (sortBy === "mostSaved")
        return (b?.favoritesCount || 0) - (a?.favoritesCount || 0);
      return 0;
    });

  const getToneColor = (tone) => {
    const colors = {
      Motivational: "bg-green-100 text-green-700",
      Sad: "bg-blue-100 text-blue-700",
      Realization: "bg-purple-100 text-purple-700",
      Gratitude: "bg-yellow-100 text-yellow-700",
    };
    return colors[tone] || "bg-gray-100 text-gray-700";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-300 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading lessons...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-2">
            Failed to load lessons
          </p>
          <p className="text-gray-500">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Header Section */}
      <div className=" py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Explore Life Lessons
          </h1>
          <p className="text-xl text-center text-indigo-100 max-w-2xl mx-auto">
            Discover wisdom and insights shared by our community
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Demo Toggle */}
        <div className="mb-6 flex justify-end">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              isUserPremium
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {isUserPremium ? "⭐ Premium User (Demo)" : "Free User (Demo)"}
          </button>
        </div>

        {/* Search and Filters */}
        <div className=" rounded-2xl shadow-lg p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-100 w-5 h-5" />
            <input
              type="text"
              placeholder="Search lessons by title or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DarkSelect
              label="Category"
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categories}
            />

            <DarkSelect
              label="Emotional Tone"
              value={selectedTone}
              onChange={setSelectedTone}
              options={emotionalTones}
            />

            <DarkSelect
              label="Sort By"
              value={sortBy}
              onChange={setSortBy}
              options={["newest", "oldest", "mostSaved"]}
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-200 font-medium">
            Showing {filteredLessons.length} lesson
            {filteredLessons.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => {
            const isPremiumLocked =
              lesson.accessLevel === "premium" && !isUserPremium;

            return (
              <div
                key={lesson._id}
                className={` rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col ${
                  isPremiumLocked ? "relative" : ""
                }`}
              >
                {/* Premium Lock Overlay */}
                {isPremiumLocked && (
                  <div className="absolute inset-0 backdrop-blur-sm  z-10 flex items-center justify-center">
                    <div className="text-center p-6">
                      <Lock className="w-12 h-12 text-yellow-200 mx-auto mb-3" />
                      <h3 className="text-xl font-bold text-gray-100 mb-2">
                        Premium Lesson
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Upgrade to view this exclusive content
                      </p>
                      <Link
                        href={"/pricing"}
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition"
                      >
                        Upgrade to Premium
                      </Link>
                    </div>
                  </div>
                )}

                {/* Card Content */}
                <div
                  className={`p-6 flex-1 flex flex-col ${
                    isPremiumLocked ? "blur-sm" : ""
                  }`}
                >
                  {/* Access Level Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        lesson.accessLevel === "premium"
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {lesson.accessLevel === "premium" ? "⭐ Premium" : "Free"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getToneColor(
                        lesson.emotionalTone
                      )}`}
                    >
                      {lesson.emotionalTone}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-100 mb-3 line-clamp-2">
                    {lesson?.title || "Untitled Lesson"}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-200 mb-4 line-clamp-3 flex-1">
                    {lesson?.description || "No description available"}
                  </p>

                  {/* Category Tag */}
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-100">
                      {lesson?.category || "Uncategorized"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                    <Image
                      src={
                        lesson?.creatorPhoto ||
                        "https://i.pravatar.cc/150?img=1"
                      }
                      alt={lesson?.creatorName || "User"}
                      width={10}
                      height={10}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://i.pravatar.cc/150?img=1";
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-200 text-sm">
                        {lesson?.creatorName || "Anonymous"}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(
                          lesson?.createdAt || Date.now()
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span>{lesson?.likesCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookmarkPlus className="w-4 h-4 text-blue-500" />
                      <span>{lesson?.favoritesCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4 text-green-500" />
                      <span>{Math.floor(Math.random() * 10000)}</span>
                    </div>
                  </div>

                  {/* See Details Button */}
                  <Link
                    href={`/public-lessons/${lesson._id}`}
                    disabled={isPremiumLocked}
                    className="w-full text-center bg-linear-to-r from-green-600 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-700 transition disabled:opacity-50  disabled:cursor-not-allowed cursor-pointer"
                  >
                    See Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredLessons.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              No lessons found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or search query
            </p>
          </div>
        )}

        {/* Pagination Controls - Add this after the "No Results" section */}
        {filteredLessons.length > 0 && data?.pagination && (
          <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
            {/* Previous Button */}
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className={`
        flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all
        ${
          page === 1
            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
            : "bg-white/10 text-white hover:bg-white/20"
        }
      `}
            >
              <ChevronLeftCircle className="w-4 h-4" />
              Previous
            </button>

            {/* Page Numbers */}
            {Array.from(
              { length: data.pagination.totalPages },
              (_, i) => i + 1
            ).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`
          min-w-[40px] h-[40px] rounded-lg font-medium transition-all
          ${
            page === pageNum
              ? "bg-gradient-to-r from-green-500 to-green-600 text-white scale-110 shadow-lg"
              : "bg-white/10 text-white hover:bg-white/20"
          }
        `}
              >
                {pageNum}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() =>
                setPage((prev) =>
                  Math.min(data.pagination.totalPages, prev + 1)
                )
              }
              disabled={page === data.pagination.totalPages}
              className={`
        flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all
        ${
          page === data.pagination.totalPages
            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
            : "bg-white/10 text-white hover:bg-white/20"
        }
      `}
            >
              Next
              <ChevronRightCircle className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
