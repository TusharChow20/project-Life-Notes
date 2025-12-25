"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/app/AxiosApi/AxiosInstence";
import Swal from "sweetalert2";
import {
  Shield,
  Mail,
  Edit2,
  Save,
  X,
  Camera,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Flag,
  Users,
  BookOpen,
  Activity,
  TrendingUp,
  Award,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminProfilePage() {
  const { data: session, update } = useSession();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");

  const { data: activityStats } = useQuery({
    queryKey: ["adminActivity", session?.user?.email],
    queryFn: async () => {
      const response = await instance.get(
        `/admin/activity/${session?.user?.email}`
      );
      return response.data;
    },
    enabled: Boolean(session?.user?.email && session?.user?.role === "admin"),
  });

  useEffect(() => {
    if (session?.user?.name) {
      setEditName(session.user.name);
    }
    if (session?.user?.image) {
      setPhotoPreview(session.user.image);
    }
  }, [session]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const response = await instance.put("/user/profile", {
        email: session?.user?.email,
        name: data.name,
        image: data.image,
      });
      return response.data;
    },
    onSuccess: async (data) => {
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.user.name,
          image: data.user.image,
        },
      });
      setIsEditing(false);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Profile updated successfully",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.message || "Failed to update profile",
      });
    },
  });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please select an image file",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "Image size must be less than 5MB",
      });
      return;
    }

    setIsUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await instance.post("/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setPhotoPreview(response.data.imageUrl);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Photo uploaded! Click Save to apply changes.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: error.response?.data?.message || "Failed to upload photo",
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      Swal.fire({
        icon: "error",
        title: "Invalid Name",
        text: "Name cannot be empty",
      });
      return;
    }

    updateProfileMutation.mutate({
      name: editName.trim(),
      image: photoPreview,
    });
  };

  const handleCancelEdit = () => {
    setEditName(session?.user?.name || "");
    setPhotoPreview(session?.user?.image || "");
    setIsEditing(false);
  };

  if (!session?.user || session?.user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-white text-xl mb-4">Access Denied</p>
          <p className="text-gray-400 mb-6">You don't have admin privileges</p>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition"
          >
            ← Back to Admin Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Admin Profile</h1>
          <p className="text-gray-300">
            Manage your admin account settings and view activity summary
          </p>
        </div>

        {/* Profile Header Card */}
        <div className=" backdrop-blur-lg shadow-2xl shadow-green-900 rounded-2xl p-8 mb-8 ">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Profile Photo */}
            <div className="relative">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-400/50 shadow-lg shadow-blue-500/50">
                <Image
                  src={photoPreview || "https://i.pravatar.cc/150?img=1"}
                  alt={session.user.name || "Admin"}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.target.src = "https://i.pravatar.cc/150?img=1";
                  }}
                />
                {isUploadingPhoto && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>
              {isEditing && (
                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600 transition shadow-lg"
                >
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={isUploadingPhoto}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div className="flex-1">
              {!isEditing ? (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">
                      {session.user.name || "Admin User"}
                    </h1>
                    <span className="px-4 py-1 border cursor-pointer hover:text-xl text-white rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                      <Shield className="w-4 h-4" />
                      ADMIN
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 mb-4">
                    <Mail className="w-4 h-4" />
                    <span>{session.user.email}</span>
                  </div>
                </>
              ) : (
                <div className="mb-4">
                  <label className="block text-white font-semibold mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                  />
                </div>
              )}

              {/* Edit Buttons */}
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveProfile}
                    disabled={updateProfileMutation.isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50"
                  >
                    {updateProfileMutation.isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-red-500/20 hover:text-red-400 transition"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activity Summary Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-400" />
            Activity Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Actions */}
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-400/30">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/30 rounded-xl">
                  <CheckCircle className="w-8 h-8 text-blue-300" />
                </div>
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">
                {activityStats?.totalActions || 0}
              </h3>
              <p className="text-gray-300 text-sm">Total Actions Taken</p>
            </div>

            {/* Lessons Moderated */}
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-lg rounded-2xl p-6 border border-green-400/30">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/30 rounded-xl">
                  <BookOpen className="w-8 h-8 text-green-300" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">
                {activityStats?.lessonsModerated || 0}
              </h3>
              <p className="text-gray-300 text-sm">Lessons Moderated</p>
            </div>

            {/* Reports Reviewed */}
            <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-lg rounded-2xl p-6 border border-yellow-400/30">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-500/30 rounded-xl">
                  <Flag className="w-8 h-8 text-yellow-300" />
                </div>
                <TrendingUp className="w-5 h-5 text-yellow-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">
                {activityStats?.reportsReviewed || 0}
              </h3>
              <p className="text-gray-300 text-sm">Reports Reviewed</p>
            </div>

            {/* Content Deleted */}
            <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-lg rounded-2xl p-6 border border-red-400/30">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-500/30 rounded-xl">
                  <Trash2 className="w-8 h-8 text-red-300" />
                </div>
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">
                {activityStats?.contentDeleted || 0}
              </h3>
              <p className="text-gray-300 text-sm">Content Deleted</p>
            </div>
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-400" />
            Recent Activity
          </h2>

          <div className="space-y-4">
            {activityStats?.recentActivity?.length > 0 ? (
              activityStats.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition"
                >
                  <div
                    className={`p-2 rounded-lg ${
                      activity.type === "approved"
                        ? "bg-green-500/20"
                        : activity.type === "deleted"
                        ? "bg-red-500/20"
                        : activity.type === "reported"
                        ? "bg-yellow-500/20"
                        : "bg-blue-500/20"
                    }`}
                  >
                    {activity.type === "approved" && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                    {activity.type === "deleted" && (
                      <Trash2 className="w-5 h-5 text-red-400" />
                    )}
                    {activity.type === "reported" && (
                      <Flag className="w-5 h-5 text-yellow-400" />
                    )}
                    {activity.type === "moderated" && (
                      <BookOpen className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">
                      {activity.description}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No recent activity to display</p>
              </div>
            )}
          </div>
        </div>

        {/* Admin Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/lessons"
            className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-lg rounded-xl hover:bg-white/20 transition"
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
            href="/admin/users"
            className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-lg rounded-xl hover:bg-white/20 transition"
          >
            <Users className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-white font-semibold">Manage Users</p>
              <p className="text-gray-400 text-sm">View and manage users</p>
            </div>
          </Link>

          <Link
            href="/admin/reports"
            className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-lg rounded-xl hover:bg-white/20 transition"
          >
            <Flag className="w-6 h-6 text-yellow-400" />
            <div>
              <p className="text-white font-semibold">View Reports</p>
              <p className="text-gray-400 text-sm">Handle user reports</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
