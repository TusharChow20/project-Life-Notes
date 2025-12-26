"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/app/AxiosApi/AxiosInstence";
import Swal from "sweetalert2";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Search,
  Shield,
  Trash2,
  Star,
  CheckCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Globe,
  Lock,
  Filter,
  BarChart3,
  Flag,
} from "lucide-react";

export default function AdminManageLessonsPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [visibility, setVisibility] = useState("");
  const [isFeatured, setIsFeatured] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");

  const categories = [
    "All",
    "Personal Growth",
    "Career",
    "Relationships",
    "Mindset",
    "Mistakes Learned",
  ];

  const { data, isLoading } = useQuery({
    queryKey: [
      "adminLessons",
      page,
      category,
      visibility,
      isFeatured,
      reviewStatus,
    ],
    queryFn: async () => {
      const response = await instance.get("/admin/lessons", {
        params: {
          page,
          limit: 6,
          category: category === "All" ? "" : category,
          visibility,
          isFeatured,
          reviewStatus,
        },
      });
      return response.data;
    },
    enabled: Boolean(session?.user?.role === "admin"),
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ lessonId, isFeatured }) => {
      const response = await instance.put(
        `/admin/lessons/${lessonId}/featured`,
        {
          isFeatured,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminLessons"]);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Featured status updated",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          error.response?.data?.message || "Failed to update featured status",
      });
    },
  });

  // Mark as reviewed mutation
  const markReviewedMutation = useMutation({
    mutationFn: async (lessonId) => {
      const response = await instance.put(`/admin/lessons/${lessonId}/review`, {
        reviewStatus: "reviewed",
        adminEmail: session?.user?.email,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminLessons"]);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Lesson marked as reviewed",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.message || "Failed to mark as reviewed",
      });
    },
  });

  // Delete lesson mutation
  const deleteLessonMutation = useMutation({
    mutationFn: async (lessonId) => {
      const response = await instance.delete(`/admin/lessons/${lessonId}`, {
        data: { adminEmail: session?.user?.email },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminLessons"]);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Lesson deleted successfully",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.message || "Failed to delete lesson",
      });
    },
  });

  const handleToggleFeatured = async (lessonId, currentFeatured, title) => {
    const newStatus = !currentFeatured;

    const result = await Swal.fire({
      title: newStatus ? "Feature Lesson?" : "Unfeature Lesson?",
      text: `${newStatus ? "Feature" : "Unfeature"} "${title}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: newStatus ? "Yes, feature it" : "Yes, unfeature it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#f59e0b",
    });

    if (result.isConfirmed) {
      toggleFeaturedMutation.mutate({ lessonId, isFeatured: newStatus });
    }
  };

  const handleDeleteLesson = async (lessonId, title) => {
    const result = await Swal.fire({
      title: "Delete Lesson?",
      html: `
        <p>This will permanently delete:</p>
        <ul style="text-align: left; margin-top: 10px;">
          <li>Lesson: <strong>${title}</strong></li>
          <li>All likes and favorites</li>
          <li>All reports associated</li>
        </ul>
        <p style="color: #dc2626; margin-top: 10px;">This action cannot be undone!</p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
    });

    if (result.isConfirmed) {
      deleteLessonMutation.mutate(lessonId);
    }
  };

  if (!session?.user || session?.user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-white text-xl">Access Denied</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/admin"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition"
          >
            ← Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <BookOpen className="w-10 h-10 text-green-400" />
                Manage Lessons
              </h1>
              <p className="text-gray-300">
                Review and moderate platform content
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {data?.stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-lg rounded-xl p-4 border border-blue-400/30">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-blue-300" />
                <p className="text-blue-300 text-sm font-semibold">Total</p>
              </div>
              <p className="text-2xl font-bold text-white">
                {data.stats.totalLessons}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-lg rounded-xl p-4 border border-green-400/30">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-green-300" />
                <p className="text-green-300 text-sm font-semibold">Public</p>
              </div>
              <p className="text-2xl font-bold text-white">
                {data.stats.publicLessons}
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-500/20 to-gray-600/20 backdrop-blur-lg rounded-xl p-4 border border-gray-400/30">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-gray-300" />
                <p className="text-gray-300 text-sm font-semibold">Private</p>
              </div>
              <p className="text-2xl font-bold text-white">
                {data.stats.privateLessons}
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-lg rounded-xl p-4 border border-yellow-400/30">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-300" />
                <p className="text-yellow-300 text-sm font-semibold">
                  Featured
                </p>
              </div>
              <p className="text-2xl font-bold text-white">
                {data.stats.featuredLessons}
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-lg rounded-xl p-4 border border-red-400/30">
              <div className="flex items-center gap-2 mb-2">
                <Flag className="w-5 h-5 text-red-300" />
                <p className="text-red-300 text-sm font-semibold">Reported</p>
              </div>
              <p className="text-2xl font-bold text-white">
                {data.stats.reportedLessons}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-white" />
            <h2 className="text-white font-semibold">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-gray-900">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Visibility
              </label>
              <select
                value={visibility}
                onChange={(e) => {
                  setVisibility(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="" className="bg-gray-900">
                  All
                </option>
                <option value="Public" className="bg-gray-900">
                  Public
                </option>
                <option value="Private" className="bg-gray-900">
                  Private
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Featured
              </label>
              <select
                value={isFeatured}
                onChange={(e) => {
                  setIsFeatured(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="" className="bg-gray-900">
                  All
                </option>
                <option value="true" className="bg-gray-900">
                  Featured Only
                </option>
                <option value="false" className="bg-gray-900">
                  Not Featured
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Review Status
              </label>
              <select
                value={reviewStatus}
                onChange={(e) => {
                  setReviewStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="" className="bg-gray-900">
                  All
                </option>
                <option value="pending" className="bg-gray-900">
                  Pending
                </option>
                <option value="reviewed" className="bg-gray-900">
                  Reviewed
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-green-400 animate-spin" />
            </div>
          ) : data?.lessons?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {data.lessons.map((lesson) => (
                  <div
                    key={lesson._id}
                    className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition border border-white/10"
                  >
                    {/* Image */}
                    {lesson.image && (
                      <div className="relative w-full h-40">
                        <Image
                          src={lesson.image}
                          alt={lesson.title}
                          fill
                          className="object-cover"
                        />
                        {lesson.isFeatured && (
                          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            FEATURED
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-4">
                      {/* Badges */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            lesson.accessLevel === "premium"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-green-500/20 text-green-300"
                          }`}
                        >
                          {lesson.accessLevel === "premium"
                            ? "⭐ Premium"
                            : "Free"}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                            lesson.visibility === "Private"
                              ? "bg-gray-500/20 text-gray-300"
                              : "bg-blue-500/20 text-blue-300"
                          }`}
                        >
                          {lesson.visibility === "Private" ? (
                            <Lock className="w-3 h-3" />
                          ) : (
                            <Globe className="w-3 h-3" />
                          )}
                          {lesson.visibility}
                        </span>
                        {lesson.reviewStatus === "reviewed" && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Reviewed
                          </span>
                        )}
                      </div>

                      {/* Title & Creator */}
                      <h3 className="text-white font-bold mb-2 line-clamp-2">
                        {lesson.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3">
                        by {lesson.creatorName}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4 text-red-400" />
                          <span>{lesson.likesCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4 text-green-400" />
                          <span>{lesson.viewsCount || 0}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleToggleFeatured(
                              lesson._id,
                              lesson.isFeatured,
                              lesson.title
                            )
                          }
                          className={`flex-1 p-2 rounded-lg transition flex items-center justify-center gap-1 text-sm font-semibold ${
                            lesson.isFeatured
                              ? "bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30"
                              : "bg-white/5 text-white hover:bg-white/10"
                          }`}
                        >
                          <Star className="w-4 h-4" />
                          {lesson.isFeatured ? "Featured" : "Feature"}
                        </button>
                        {lesson.reviewStatus !== "reviewed" && (
                          <button
                            onClick={() =>
                              markReviewedMutation.mutate(lesson._id)
                            }
                            className="flex-1 p-2 bg-green-500/20 text-green-300 hover:bg-green-500/30 rounded-lg transition flex items-center justify-center gap-1 text-sm font-semibold"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Review
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleDeleteLesson(lesson._id, lesson.title)
                          }
                          className="p-2 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* View Details */}
                      <Link
                        href={`/public-lessons/${lesson._id}`}
                        className="block mt-3 text-center text-blue-400 hover:text-blue-300 text-sm font-semibold"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data?.pagination && data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                  <p className="text-gray-300 text-sm">
                    Page {page} of {data.pagination.totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-white font-semibold px-4">
                      {page}
                    </span>
                    <button
                      onClick={() =>
                        setPage((p) =>
                          Math.min(data.pagination.totalPages, p + 1)
                        )
                      }
                      disabled={page === data.pagination.totalPages}
                      className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                No Lessons Found
              </h3>
              <p className="text-gray-400">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
