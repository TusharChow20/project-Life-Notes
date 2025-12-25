"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/app/AxiosApi/AxiosInstence";
import Swal from "sweetalert2";
import {
  User,
  Mail,
  BookOpen,
  Heart,
  Crown,
  Edit2,
  Save,
  X,
  Camera,
  Loader2,
  Calendar,
  Tag,
  Eye,
  Lock,
  Globe,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");

  // Fetch user's lessons
  const { data: userLessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ["userLessons", session?.user?.email],
    queryFn: async () => {
      const response = await instance.get(
        `/publicLesson/user/${session?.user?.email}`
      );
      return response.data;
    },
    enabled: Boolean(session?.user?.email),
  });

  // Fetch favorites count
  const { data: favoritesData } = useQuery({
    queryKey: ["favoritesCount", session?.user?._id || session?.user?.id],
    queryFn: async () => {
      const userId = session?.user?._id || session?.user?.id;
      const response = await instance.get(
        `/publicLesson/favorites/count?userId=${userId}`
      );
      return response.data;
    },
    enabled: Boolean(session?.user?._id || session?.user?.id),
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
      queryClient.invalidateQueries(["userLessons"]);
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

  const getToneColor = (tone) => {
    const colors = {
      Motivational: "bg-green-100 text-green-700",
      Sad: "bg-blue-100 text-blue-700",
      Realization: "bg-purple-100 text-purple-700",
      Gratitude: "bg-yellow-100 text-yellow-700",
    };
    return colors[tone] || "bg-gray-100 text-gray-700";
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">
            Please log in to view your profile
          </p>
          <Link
            href="/login"
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/20">
                <Image
                  src={photoPreview || "https://i.pravatar.cc/150?img=1"}
                  alt={session.user.name || "User"}
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
                  className="absolute bottom-0 right-0 p-2 bg-green-500 text-white rounded-full cursor-pointer hover:bg-green-600 transition"
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
                      {session.user.name || "Anonymous User"}
                    </h1>
                    {session.user.isPremium && (
                      <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full text-sm font-semibold flex items-center gap-1">
                        <Crown className="w-4 h-4" />
                        Premium
                      </span>
                    )}
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
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your name"
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-green-400" />
                  <span className="text-white font-semibold">
                    {userLessons?.length || 0}
                  </span>
                  <span className="text-gray-400">Lessons Created</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  <span className="text-white font-semibold">
                    {favoritesData?.count || 0}
                  </span>
                  <span className="text-gray-400">Lessons Saved</span>
                </div>
              </div>

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
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition disabled:opacity-50"
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

        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">My Lessons</h2>
            <Link
              href="/dashboard/add-lesson"
              className="px-4 py-2 bg-linear-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition"
            >
              + Create New Lesson
            </Link>
          </div>

          {lessonsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-green-400 animate-spin" />
            </div>
          ) : userLessons?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userLessons.map((lesson) => (
                <div
                  key={lesson._id}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Lesson Image */}
                  {lesson.image && (
                    <div className="relative w-full h-48">
                      <Image
                        src={lesson.image}
                        alt={lesson.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    {/* Badges */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          lesson.accessLevel === "premium"
                            ? "bg-linear-to-r from-yellow-400 to-yellow-500 text-white"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {lesson.accessLevel === "premium"
                          ? "⭐ Premium"
                          : "Free"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                          lesson.visibility === "Private"
                            ? "bg-gray-600 text-white"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {lesson.visibility === "Private" ? (
                          <>
                            <Lock className="w-3 h-3" />
                            Private
                          </>
                        ) : (
                          <>
                            <Globe className="w-3 h-3" />
                            Public
                          </>
                        )}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                      {lesson.title}
                    </h3>

                    <p className="text-gray-300 mb-4 line-clamp-3 text-sm">
                      {lesson.description}
                    </p>

                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getToneColor(
                          lesson.emotionalTone
                        )}`}
                      >
                        {lesson.emotionalTone}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {lesson.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-4 text-sm text-gray-400 pb-4 border-b border-white/10">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-400" />
                        <span>{lesson.likesCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-green-400" />
                        <span>{lesson.favoritesCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span>
                          {new Date(lesson.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/public-lessons/${lesson._id}`}
                      className="block w-full text-center bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/5 rounded-2xl">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                No Lessons Yet
              </h3>
              <p className="text-gray-400 mb-6">
                Start sharing your insights and life experiences
              </p>
              <Link
                href="/dashboard/add-lesson"
                className="inline-block px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition"
              >
                Create Your First Lesson
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
