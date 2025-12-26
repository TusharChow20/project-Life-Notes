"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import instance from "@/app/AxiosApi/AxiosInstence";
import Link from "next/link";
import {
  Users,
  BookOpen,
  Flag,
  TrendingUp,
  Calendar,
  Award,
  Shield,
  Eye,
  Heart,
  Loader2,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboardHome() {
  const { data: session } = useSession();
  const [dateRange, setDateRange] = useState("30");

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: async () => {
      const response = await instance.get("/admin/dashboard/stats");
      return response.data;
    },
    enabled: Boolean(session?.user?.role === "admin"),
    retry: 2,
  });

  const {
    data: growthData,
    isLoading: growthLoading,
    error: growthError,
  } = useQuery({
    queryKey: ["adminGrowthData", dateRange],
    queryFn: async () => {
      const response = await instance.get(
        `/admin/dashboard/growth?days=${dateRange}`
      );
      return response.data;
    },
    enabled: Boolean(session?.user?.role === "admin"),
    retry: 2,
  });

  if (!session?.user || session?.user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-white text-xl mb-4">Access Denied</p>
          <p className="text-gray-400 mb-6">
            You don&apos;t have admin privileges
          </p>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-white text-xl mb-4">Failed to Load Dashboard</p>
          <p className="text-gray-400 mb-6">
            {statsError?.response?.data?.message ||
              statsError?.message ||
              "Unable to fetch dashboard data"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="text-gray-300">Platform analytics and monitoring</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-400/30 hover:border-blue-400/50 transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/30 rounded-xl">
                <Users className="w-8 h-8 text-blue-300" />
              </div>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">
              {stats?.totalUsers?.toLocaleString() || 0}
            </h3>
            <p className="text-gray-300 text-sm">Total Users</p>
            <p className="text-blue-400 text-xs mt-2">
              +{stats?.newUsersToday || 0} today
            </p>
          </div>

          <div className="bg-linear-to-br from-green-500/20 to-green-600/20 backdrop-blur-lg rounded-2xl p-6 border border-green-400/30 hover:border-green-400/50 transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/30 rounded-xl">
                <BookOpen className="w-8 h-8 text-green-300" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">
              {stats?.totalLessons?.toLocaleString() || 0}
            </h3>
            <p className="text-gray-300 text-sm">Total Lessons</p>
            <p className="text-green-400 text-xs mt-2">
              +{stats?.newLessonsToday || 0} today
            </p>
          </div>

          {/* Reported Lessons */}
          <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-lg rounded-2xl p-6 border border-red-400/30 hover:border-red-400/50 transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/30 rounded-xl">
                <Flag className="w-8 h-8 text-red-300" />
              </div>
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">
              {stats?.reportedLessons || 0}
            </h3>
            <p className="text-gray-300 text-sm">Reported Lessons</p>
            <Link
              href="/dashboard/admin/reported-lessons"
              className="text-red-400 text-xs mt-2 hover:underline inline-block"
            >
              View all →
            </Link>
          </div>

          {/* Total Engagement */}
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-400/30 hover:border-purple-400/50 transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/30 rounded-xl">
                <Heart className="w-8 h-8 text-purple-300" />
              </div>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">
              {stats?.totalEngagement?.toLocaleString() || 0}
            </h3>
            <p className="text-gray-300 text-sm">Total Engagement</p>
            <p className="text-purple-400 text-xs mt-2">Likes + Favorites</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                User Growth
              </h2>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-1 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7" className="bg-gray-900">
                  Last 7 Days
                </option>
                <option value="30" className="bg-gray-900">
                  Last 30 Days
                </option>
                <option value="90" className="bg-gray-900">
                  Last 90 Days
                </option>
              </select>
            </div>
            {growthLoading ? (
              <div className="h-[250px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
            ) : growthError ? (
              <div className="h-[250px] flex items-center justify-center">
                <p className="text-red-400 text-sm">
                  Failed to load chart data
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={growthData?.userGrowth || []}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Lesson Growth Chart */}
          <div className=" backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-400" />
                Lesson Growth
              </h2>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-1 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="7" className="bg-gray-900">
                  Last 7 Days
                </option>
                <option value="30" className="bg-gray-900">
                  Last 30 Days
                </option>
                <option value="90" className="bg-gray-900">
                  Last 90 Days
                </option>
              </select>
            </div>
            {growthLoading ? (
              <div className="h-[250px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
              </div>
            ) : growthError ? (
              <div className="h-[250px] flex items-center justify-center">
                <p className="text-red-400 text-sm">
                  Failed to load chart data
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={growthData?.lessonGrowth || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Most Active Contributors & Today's New Lessons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Most Active Contributors */}
          <div className=" backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Top 5 Contributors
            </h2>
            <div className="space-y-4">
              {stats?.topContributors && stats.topContributors.length > 0 ? (
                stats.topContributors.map((contributor, index) => (
                  <div
                    key={contributor._id}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition"
                  >
                    <div className="flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                          index === 0
                            ? "bg-yellow-500 text-white"
                            : index === 1
                            ? "bg-gray-400 text-white"
                            : index === 2
                            ? "bg-orange-600 text-white"
                            : "bg-blue-500/30 text-blue-300"
                        }`}
                      >
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate">
                        {contributor.name}
                      </p>
                      <p className="text-gray-400 text-sm truncate">
                        {contributor.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">
                        {contributor.totalLessons}
                      </p>
                      <p className="text-gray-400 text-xs">lessons</p>
                      <p className="text-green-400 text-xs">
                        {contributor.totalLikes} likes
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">No contributors yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Today's New Lessons */}
          <div className=" backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-400" />
              Today&apos;s New Lessons ({stats?.todayLessons?.length || 0})
            </h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {stats?.todayLessons && stats.todayLessons.length > 0 ? (
                stats.todayLessons.map((lesson) => (
                  <Link
                    key={lesson._id}
                    href={`/public-lessons/${lesson._id}`}
                    className="block p-4 bg-white/5 rounded-xl hover:bg-white/10 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold truncate mb-1">
                          {lesson.title}
                        </h3>
                        <p className="text-gray-400 text-sm truncate">
                          by {lesson.creatorName}
                        </p>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                            {lesson.category}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              lesson.accessLevel === "premium"
                                ? "bg-yellow-500/20 text-yellow-300"
                                : "bg-green-500/20 text-green-300"
                            }`}
                          >
                            {lesson.accessLevel === "premium"
                              ? "⭐ Premium"
                              : "Free"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <Eye className="w-4 h-4" />
                        <span>{lesson.viewsCount || 0}</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">No new lessons today</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Action Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/admin/manage-users"
            className="flex items-center gap-3 p-4  backdrop-blur-lg rounded-xl hover:bg-white/20 transition border border-white/20"
          >
            <Users className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-white font-semibold">Manage Users</p>
              <p className="text-gray-400 text-sm">View and manage all users</p>
            </div>
          </Link>

          <Link
            href="/dashboard/admin/manage-lessons"
            className="flex items-center gap-3 p-4  backdrop-blur-lg rounded-xl hover:bg-white/20 transition border border-white/20"
          >
            <BookOpen className="w-6 h-6 text-green-400" />
            <div>
              <p className="text-white font-semibold">Manage Lessons</p>
              <p className="text-gray-400 text-sm">
                Review and moderate content
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/admin/reported-lessons"
            className="flex items-center gap-3 p-4  backdrop-blur-lg rounded-xl hover:bg-white/20 transition border border-white/20"
          >
            <Flag className="w-6 h-6 text-red-400" />
            <div>
              <p className="text-white font-semibold">Reported Lessons</p>
              <p className="text-gray-400 text-sm">
                {stats?.reportedLessons || 0} pending
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
