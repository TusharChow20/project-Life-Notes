"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/app/AxiosApi/AxiosInstence";
import Swal from "sweetalert2";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  Trash2,
  Loader2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Crown,
  BookOpen,
  Calendar,
} from "lucide-react";

export default function AdminManageUsersPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Fetch users
  const { data, isLoading } = useQuery({
    queryKey: ["adminUsers", page, search, sortBy, sortOrder],
    queryFn: async () => {
      const response = await instance.get("/admin/users", {
        params: {
          page,
          limit: 10,
          search,
          sortBy,
          sortOrder,
        },
      });
      return response.data;
    },
    enabled: Boolean(session?.user?.role === "admin"),
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }) => {
      const response = await instance.put(`/admin/users/${userId}/role`, {
        role,
        adminEmail: session?.user?.email,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminUsers"]);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "User role updated successfully",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.message || "Failed to update role",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => {
      const response = await instance.delete(`/admin/users/${userId}`, {
        data: { adminEmail: session?.user?.email },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminUsers"]);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "User and all their content deleted successfully",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.message || "Failed to delete user",
      });
    },
  });

  const handleRoleChange = async (userId, currentRole, userName) => {
    const newRole = currentRole === "admin" ? "user" : "admin";

    const result = await Swal.fire({
      title: `Change Role?`,
      text: `Change ${userName}'s role to ${newRole.toUpperCase()}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, make ${newRole}`,
      cancelButtonText: "Cancel",
      confirmButtonColor: newRole === "admin" ? "#3b82f6" : "#6b7280",
    });

    if (result.isConfirmed) {
      updateRoleMutation.mutate({ userId, role: newRole });
    }
  };

  const handleDeleteUser = async (userId, userName, userEmail) => {
    const result = await Swal.fire({
      title: "Delete User?",
      html: `
        <p>This will permanently delete:</p>
        <ul style="text-align: left; margin-top: 10px;">
          <li>User account: <strong>${userName}</strong></li>
          <li>Email: <strong>${userEmail}</strong></li>
          <li>All their lessons</li>
          <li>All their likes and favorites</li>
        </ul>
        <p style="color: #dc2626; margin-top: 10px;">This action cannot be undone!</p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete everything",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
    });

    if (result.isConfirmed) {
      deleteUserMutation.mutate(userId);
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
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
                <Users className="w-10 h-10 text-blue-400" />
                Manage Users
              </h1>
              <p className="text-gray-300">
                View and manage all registered users
              </p>
            </div>
          </div>
        </div>

        <div className=" backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className=" backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-green-400 animate-spin" />
            </div>
          ) : data?.users?.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                        User
                      </th>
                      <th
                        className="px-6 py-4 text-left text-sm font-semibold text-white cursor-pointer hover:bg-white/5"
                        onClick={() => handleSort("email")}
                      >
                        <div className="flex items-center gap-2">
                          Email
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                        Role
                      </th>
                      <th
                        className="px-6 py-4 text-left text-sm font-semibold text-white cursor-pointer hover:bg-white/5"
                        onClick={() => handleSort("totalLessons")}
                      >
                        <div className="flex items-center gap-2">
                          Lessons
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </th>
                      <th
                        className="px-6 py-4 text-left text-sm font-semibold text-white cursor-pointer hover:bg-white/5"
                        onClick={() => handleSort("createdAt")}
                      >
                        <div className="flex items-center gap-2">
                          Joined
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {data.users.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-white/5 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                              <Image
                                src={
                                  user.image ||
                                  "https://i.pravatar.cc/150?img=1"
                                }
                                alt={user.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-white font-semibold flex items-center gap-2">
                                {user.name}
                                {user.isPremium && (
                                  <Crown className="w-4 h-4 text-yellow-400" />
                                )}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-300">{user.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                              user.role === "admin"
                                ? "bg-blue-500/20 text-blue-300"
                                : "bg-gray-500/20 text-gray-300"
                            }`}
                          >
                            {user.role === "admin" ? (
                              <Shield className="w-3 h-3" />
                            ) : (
                              <Users className="w-3 h-3" />
                            )}
                            {user.role?.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-white">
                            <BookOpen className="w-4 h-4 text-green-400" />
                            <span className="font-semibold">
                              {user.totalLessons || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <Calendar className="w-4 h-4" />
                            {new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleRoleChange(user._id, user.role, user.name)
                              }
                              disabled={updateRoleMutation.isLoading}
                              className={`p-2 rounded-lg transition disabled:opacity-50 ${
                                user.role === "admin"
                                  ? "bg-gray-500/20 hover:bg-gray-500/30 text-gray-300"
                                  : "bg-blue-500/20 hover:bg-blue-500/30 text-blue-300"
                              }`}
                              title={
                                user.role === "admin"
                                  ? "Demote to User"
                                  : "Promote to Admin"
                              }
                            >
                              {user.role === "admin" ? (
                                <ShieldAlert className="w-5 h-5" />
                              ) : (
                                <Shield className="w-5 h-5" />
                              )}
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteUser(
                                  user._id,
                                  user.name,
                                  user.email
                                )
                              }
                              disabled={deleteUserMutation.isLoading}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition disabled:opacity-50"
                              title="Delete User"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {data?.pagination && data.pagination.totalPages > 1 && (
                <div className="px-6 py-4 bg-white/5 flex items-center justify-between">
                  <p className="text-gray-300 text-sm">
                    Showing {(page - 1) * 10 + 1} to{" "}
                    {Math.min(page * 10, data.pagination.total)} of{" "}
                    {data.pagination.total} users
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
                      {page} / {data.pagination.totalPages}
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
              <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                No Users Found
              </h3>
              <p className="text-gray-400">Try adjusting your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
