"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import instance from "@/app/AxiosApi/AxiosInstence";
import Swal from "sweetalert2";
import {
  BookOpen,
  Heart,
  BookmarkPlus,
  Eye,
  Edit,
  Trash2,
  Globe,
  Lock,
  Calendar,
  Filter,
  Search,
  Plus,
  ArrowLeft,
  Crown,
  ToggleLeft,
  ToggleRight,
  Loader2,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EditLessonModal } from "@/Component/EditLessonModal";
import { useSession } from "next-auth/react";

export default function MyLessonsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterAccessLevel, setFilterAccessLevel] = useState("All");
  const [filterVisibility, setFilterVisibility] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Fetch user's lessons
  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["myLessons", session?.user?.email],
    queryFn: async () => {
      const response = await instance.get(
        `/publicLesson/user/${session?.user?.email}`
      );
      return response.data;
    },
    enabled: !!session?.user?.email,
  });

  // Calculate stats
  const stats = {
    totalLessons: lessons.length,
    totalReactions: lessons.reduce(
      (sum, lesson) => sum + (lesson.likesCount || 0),
      0
    ),
    totalSaves: lessons.reduce(
      (sum, lesson) => sum + (lesson.favoritesCount || 0),
      0
    ),
  };

  const filteredLessons = lessons
    .filter((lesson) => {
      const matchesSearch = lesson.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        filterCategory === "All" || lesson.category === filterCategory;
      const matchesAccessLevel =
        filterAccessLevel === "All" || lesson.accessLevel === filterAccessLevel;
      const matchesVisibility =
        filterVisibility === "All" || lesson.visibility === filterVisibility;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesAccessLevel &&
        matchesVisibility
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "mostLiked":
          return (b.likesCount || 0) - (a.likesCount || 0);
        case "mostSaved":
          return (b.favoritesCount || 0) - (a.favoritesCount || 0);
        default:
          return 0;
      }
    });

  const deleteMutation = useMutation({
    mutationFn: async (lessonId) => {
      await instance.delete(`/publicLesson/${lessonId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myLessons"]);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Lesson has been deleted successfully",
        timer: 2000,
        showConfirmButton: false,
      });
    },
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ lessonId, newVisibility }) => {
      await instance.patch(`/publicLesson/${lessonId}/visibility`, {
        visibility: newVisibility,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myLessons"]);
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Visibility has been updated",
        timer: 2000,
        showConfirmButton: false,
      });
    },
  });

  // Handlers
  const handleDelete = async (lesson) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(lesson._id);
    }
  };

  const handleToggleVisibility = async (lesson) => {
    const newVisibility = lesson.visibility === "Public" ? "Private" : "Public";

    const result = await Swal.fire({
      title: `Make ${newVisibility}?`,
      text: `This lesson will be ${newVisibility.toLowerCase()}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, change it",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      toggleVisibilityMutation.mutate({
        lessonId: lesson._id,
        newVisibility,
      });
    }
  };

  const handleEdit = (lesson) => {
    setSelectedLesson(lesson);
    setShowEditModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">My Lessons</h1>
              <p className="text-gray-300">Manage all your created lessons</p>
            </div>
            <Link
              href="/add-lesson"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Create New Lesson
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Lessons</p>
                <p className="text-3xl font-bold text-white">
                  {stats.totalLessons}
                </p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <BookOpen className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Reactions</p>
                <p className="text-3xl font-bold text-white">
                  {stats.totalReactions}
                </p>
              </div>
              <div className="p-3 bg-red-500/20 rounded-lg">
                <Heart className="w-8 h-8 text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Saves</p>
                <p className="text-3xl font-bold text-white">
                  {stats.totalSaves}
                </p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <BookmarkPlus className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search lessons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="All">All Categories</option>
              <option value="Personal Growth">Personal Growth</option>
              <option value="Career">Career</option>
              <option value="Relationships">Relationships</option>
              <option value="Mindset">Mindset</option>
              <option value="Mistakes Learned">Mistakes Learned</option>
            </select>

            {/* Access Level Filter */}
            <select
              value={filterAccessLevel}
              onChange={(e) => setFilterAccessLevel(e.target.value)}
              className="px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="All">All Access</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="mostLiked">Most Liked</option>
              <option value="mostSaved">Most Saved</option>
            </select>
          </div>
        </div>

        {/* Lessons Table - Desktop */}
        <div className="hidden lg:block bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Lesson
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Access
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Visibility
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Stats
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredLessons.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-300 text-lg mb-2">
                        No lessons found
                      </p>
                      <p className="text-gray-500 mb-4">
                        Create your first lesson to get started
                      </p>
                      <Link
                        href="/add-lesson"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition"
                      >
                        <Plus className="w-5 h-5" />
                        Create Lesson
                      </Link>
                    </td>
                  </tr>
                ) : (
                  filteredLessons.map((lesson) => (
                    <tr
                      key={lesson._id}
                      className="hover:bg-white/5 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {lesson.image && (
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={lesson.image}
                                alt={lesson.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-white font-medium truncate">
                              {lesson.title}
                            </p>
                            <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(lesson.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                          {lesson.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {lesson.accessLevel === "premium" ? (
                          <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full text-sm flex items-center gap-1 w-fit">
                            <Crown className="w-3 h-3" />
                            Premium
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                            Free
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleVisibility(lesson)}
                          className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                            lesson.visibility === "Public"
                              ? "bg-blue-500/20 text-blue-300"
                              : "bg-gray-500/20 text-gray-300"
                          }`}
                        >
                          {lesson.visibility === "Public" ? (
                            <Globe className="w-3 h-3" />
                          ) : (
                            <Lock className="w-3 h-3" />
                          )}
                          {lesson.visibility}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4 text-sm text-gray-300">
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {lesson.likesCount || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookmarkPlus className="w-4 h-4" />
                            {lesson.favoritesCount || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              router.push(`/public-lessons/${lesson._id}`)
                            }
                            className="p-2 bg-blue-500/20 cursor-pointer text-blue-300 rounded-lg hover:bg-blue-500/30 transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(lesson)}
                            className="p-2 cursor-pointer bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(lesson)}
                            disabled={deleteMutation.isLoading}
                            className="p-2 bg-red-500/20 cursor-pointer text-red-300 rounded-lg hover:bg-red-500/30 transition disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {filteredLessons.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center border border-white/20">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 text-lg mb-2">No lessons found</p>
              <p className="text-gray-500 mb-4">Create your first lesson</p>
              <Link
                href="/add-lesson"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg"
              >
                <Plus className="w-5 h-5" />
                Create Lesson
              </Link>
            </div>
          ) : (
            filteredLessons.map((lesson) => (
              <div
                key={lesson._id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
              >
                {lesson.image && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={lesson.image}
                      alt={lesson.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h3 className="text-white font-semibold text-lg mb-2">
                  {lesson.title}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                    {lesson.category}
                  </span>
                  {lesson.accessLevel === "premium" ? (
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full text-sm flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      Premium
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                      Free
                    </span>
                  )}
                  <button
                    onClick={() => handleToggleVisibility(lesson)}
                    className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                      lesson.visibility === "Public"
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-gray-500/20 text-gray-300"
                    }`}
                  >
                    {lesson.visibility === "Public" ? (
                      <Globe className="w-3 h-3" />
                    ) : (
                      <Lock className="w-3 h-3" />
                    )}
                    {lesson.visibility}
                  </button>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(lesson.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {lesson.likesCount || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookmarkPlus className="w-4 h-4" />
                    {lesson.favoritesCount || 0}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/public-lesson/${lesson._id}`)}
                    className="flex-1 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(lesson)}
                    className="flex-1 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(lesson)}
                    className="flex-1 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Modal - We'll create this component next */}
      {showEditModal && selectedLesson && (
        <EditLessonModal
          lesson={selectedLesson}
          onClose={() => {
            setShowEditModal(false);
            setSelectedLesson(null);
          }}
          onSuccess={() => {
            queryClient.invalidateQueries(["myLessons"]);
            setShowEditModal(false);
            setSelectedLesson(null);
          }}
        />
      )}
    </div>
  );
}
<EditLessonModal></EditLessonModal>;
