"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/app/AxiosApi/AxiosInstence";
import Swal from "sweetalert2";
import Link from "next/link";
import {
  Flag,
  Shield,
  Trash2,
  X,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Calendar,
  User,
  Mail,
} from "lucide-react";

export default function AdminReportedLessonsPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showReportsModal, setShowReportsModal] = useState(false);

  // Fetch reported lessons
  const { data, isLoading } = useQuery({
    queryKey: ["adminReportedLessons", page],
    queryFn: async () => {
      const response = await instance.get("/admin/reports", {
        params: {
          page,
          limit: 10,
        },
      });
      return response.data;
    },
    enabled: Boolean(session?.user?.role === "admin"),
  });

  const deleteLessonMutation = useMutation({
    mutationFn: async (lessonId) => {
      const response = await instance.delete(`/admin/lessons/${lessonId}`, {
        data: { adminEmail: session?.user?.email },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminReportedLessons"]);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Lesson and all reports deleted successfully",
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

  const ignoreReportsMutation = useMutation({
    mutationFn: async (lessonId) => {
      const response = await instance.put(`/admin/reports/${lessonId}/ignore`, {
        adminEmail: session?.user?.email,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminReportedLessons"]);
      Swal.fire({
        icon: "success",
        title: "Ignored!",
        text: "Reports ignored successfully",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.message || "Failed to ignore reports",
      });
    },
  });

  const handleViewReports = (lesson) => {
    setSelectedLesson(lesson);
    setShowReportsModal(true);
  };

  const handleDeleteLesson = async (lessonId, lessonTitle, reportCount) => {
    const result = await Swal.fire({
      title: "Delete Lesson?",
      html: `
        <p>This will permanently delete:</p>
        <ul style="text-align: left; margin-top: 10px;">
          <li>Lesson: <strong>${lessonTitle}</strong></li>
          <li><strong>${reportCount}</strong> associated reports</li>
          <li>All likes and favorites</li>
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

  const handleIgnoreReports = async (lessonId, lessonTitle, reportCount) => {
    const result = await Swal.fire({
      title: "Ignore Reports?",
      html: `
        <p>This will ignore all <strong>${reportCount}</strong> reports for:</p>
        <p style="margin-top: 10px;"><strong>${lessonTitle}</strong></p>
        <p style="margin-top: 10px;">The lesson will remain published, but the reports will be marked as resolved.</p>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, ignore reports",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      ignoreReportsMutation.mutate(lessonId);
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
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Flag className="w-10 h-10 text-red-400" />
              Reported Lessons
            </h1>
            <p className="text-gray-300">
              Review community-reported content and take appropriate action
            </p>
          </div>
        </div>

        {data?.reportedLessons?.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-semibold mb-1">
                {data.reportedLessons.length} lesson(s) with pending reports
              </p>
              <p className="text-gray-300 text-sm">
                Please review and take action on reported content to maintain
                platform quality
              </p>
            </div>
          </div>
        )}

        {/* Reported Lessons Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-red-400 animate-spin" />
            </div>
          ) : data?.reportedLessons?.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                        Lesson Title
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                        Reports
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                        View Reports
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {data.reportedLessons.map((item) => (
                      <tr
                        key={item._id}
                        className="hover:bg-white/5 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            <Flag className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                            <div>
                              <p className="text-white font-semibold mb-1">
                                {item.lessonTitle}
                              </p>
                              <Link
                                href={`/public-lessons/${item._id}`}
                                target="_blank"
                                className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                              >
                                <Eye className="w-4 h-4" />
                                View Lesson
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-12 h-12 bg-red-500/20 text-red-300 rounded-full text-xl font-bold">
                            {item.reportCount}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleViewReports(item)}
                            className="px-4 py-2 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 rounded-lg font-semibold transition"
                          >
                            View All Reports
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() =>
                                handleDeleteLesson(
                                  item._id,
                                  item.lessonTitle,
                                  item.reportCount
                                )
                              }
                              disabled={deleteLessonMutation.isLoading}
                              className="px-4 py-2 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-lg font-semibold transition disabled:opacity-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Lesson
                            </button>
                            <button
                              onClick={() =>
                                handleIgnoreReports(
                                  item._id,
                                  item.lessonTitle,
                                  item.reportCount
                                )
                              }
                              disabled={ignoreReportsMutation.isLoading}
                              className="px-4 py-2 bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 rounded-lg font-semibold transition disabled:opacity-50 flex items-center gap-2"
                            >
                              <X className="w-4 h-4" />
                              Ignore
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data?.pagination && data.pagination.totalPages > 1 && (
                <div className="px-6 py-4 bg-white/5 flex items-center justify-between">
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
              <Flag className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                No Reported Lessons
              </h3>
              <p className="text-gray-400">
                All reports have been reviewed and resolved
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Reports Detail Modal */}
      {showReportsModal && selectedLesson && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowReportsModal(false)}
        >
          <div
            className="bg-gray-900 rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                  <Flag className="w-6 h-6 text-red-400" />
                  Reports for: {selectedLesson.lessonTitle}
                </h3>
                <p className="text-gray-400">
                  {selectedLesson.reportCount} total report(s)
                </p>
              </div>
              <button
                onClick={() => setShowReportsModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Reports List */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {selectedLesson.reports.map((report, index) => (
                  <div
                    key={report._id}
                    className="bg-white/5 rounded-xl p-4 border border-white/10"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-500/20 text-red-300 rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white font-semibold flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {report.reporterName}
                          </p>
                          <p className="text-gray-400 text-sm flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {report.reporterEmail}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Calendar className="w-4 h-4" />
                        {new Date(report.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-3 mb-2">
                      <p className="text-sm text-gray-400 mb-1">Reason:</p>
                      <p className="text-white font-semibold">
                        {report.reason}
                      </p>
                    </div>

                    {report.description && (
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-sm text-gray-400 mb-1">
                          Additional details:
                        </p>
                        <p className="text-gray-300">{report.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-white/10 flex items-center gap-3">
              <button
                onClick={() => {
                  setShowReportsModal(false);
                  handleDeleteLesson(
                    selectedLesson._id,
                    selectedLesson.lessonTitle,
                    selectedLesson.reportCount
                  );
                }}
                className="flex-1 px-4 py-3 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-xl font-semibold transition flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Delete Lesson
              </button>
              <button
                onClick={() => {
                  setShowReportsModal(false);
                  handleIgnoreReports(
                    selectedLesson._id,
                    selectedLesson.lessonTitle,
                    selectedLesson.reportCount
                  );
                }}
                className="flex-1 px-4 py-3 bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 rounded-xl font-semibold transition flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Ignore All Reports
              </button>
              <button
                onClick={() => setShowReportsModal(false)}
                className="px-6 py-3 bg-white/10 text-white hover:bg-white/20 rounded-xl font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
