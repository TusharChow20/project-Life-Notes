"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import instance from "@/app/AxiosApi/AxiosInstence";
import Swal from "sweetalert2";
import {
  BookOpen,
  FileText,
  Tag,
  Heart,
  Upload,
  Lock,
  Globe,
  Crown,
  ArrowLeft,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const categories = [
  "Personal Growth",
  "Career",
  "Relationships",
  "Mindset",
  "Mistakes Learned",
];

const emotionalTones = ["Motivational", "Sad", "Realization", "Gratitude"];

export default function AddLessonPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: categories[0],
      emotionalTone: emotionalTones[0],
      image: "",
      imagePublicId: "",
      privacy: "Public",
      accessLevel: "free",
    },
  });

  const isUserPremium = session?.user?.isPremium === true;
  const watchImage = watch("image");
  const watchImagePublicId = watch("imagePublicId");

  const handleImageUpload = async (e) => {
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

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await instance.post("/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setValue("image", response.data.imageUrl);
        setValue("imagePublicId", response.data.publicId);
        setImagePreview(response.data.imageUrl);

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Image uploaded successfully",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: error.response?.data?.message || "Failed to upload image",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (watchImagePublicId) {
      try {
        await instance.delete(
          `/delete-image/${encodeURIComponent(watchImagePublicId)}`
        );
      } catch (error) {
        console.error("Failed to delete image:", error);
      }
    }

    setValue("image", "");
    setValue("imagePublicId", "");
    setImagePreview("");
  };

  const onSubmit = async (data) => {
    if (data.description.length < 50) {
      Swal.fire({
        icon: "error",
        title: "Too Short",
        text: "Description must be at least 50 characters long",
      });
      return;
    }

    if (data.accessLevel === "premium" && !isUserPremium) {
      const result = await Swal.fire({
        icon: "warning",
        title: "Premium Required",
        text: "You need to upgrade to Premium to create paid lessons",
        showCancelButton: true,
        confirmButtonText: "Upgrade Now",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        router.push("/pricing");
      }
      return;
    }

    try {
      const lessonData = {
        title: data.title.trim(),
        description: data.description.trim(),
        category: data.category,
        emotionalTone: data.emotionalTone,
        image: data.image || null,
        imagePublicId: data.imagePublicId || null,
        visibility: data.privacy,
        accessLevel: data.accessLevel,
        creatorId: session?.user?._id || session?.user?.id,
        creatorName: session?.user?.name,
        creatorEmail: session?.user?.email,
        creatorPhoto: session?.user?.image,
        likesCount: 0,
        favoritesCount: 0,
        commentsCount: 0,
      };

      const response = await instance.post("/publicLesson", lessonData);

      if (response.data.success) {
        const result = await Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Your lesson has been created successfully",
          confirmButtonText: "View Lesson",
          showCancelButton: true,
          cancelButtonText: "Create Another",
        });

        if (result.isConfirmed) {
          router.push(`/public-lesson/${response.data.lessonId}`);
        } else {
          reset();
          setImagePreview("");
        }
      }
    } catch (error) {
      console.error("Error creating lesson:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          error.response?.data?.message ||
          "Failed to create lesson. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen  py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">
            Create New Lesson
          </h1>
          <p className="text-gray-300">
            Share your insights and life experiences with the community
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/1 backdrop-blur-lg rounded-2xl p-8 space-y-6"
        >
          <div>
            <label className="flex items-center gap-2 text-white font-semibold mb-2">
              <BookOpen className="w-5 h-5" />
              Lesson Title *
            </label>
            <input
              {...register("title", { required: "Title is required" })}
              type="text"
              placeholder="Enter a compelling title for your lesson..."
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              maxLength={100}
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
            <p className="text-gray-400 text-sm mt-1">
              {watch("title")?.length || 0}/100 characters
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-white font-semibold mb-2">
              <FileText className="w-5 h-5" />
              Full Description / Story *
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 50,
                  message: "Description must be at least 50 characters",
                },
              })}
              placeholder="Share your story, insight, or lesson learned... (minimum 50 characters)"
              rows={10}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
            <p className="text-gray-400 text-sm mt-1">
              {watch("description")?.length || 0} characters (minimum 50)
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-white font-semibold mb-2">
                <Tag className="w-5 h-5" />
                Category *
              </label>
              <select
                {...register("category")}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-gray-900">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-white font-semibold mb-2">
                <Heart className="w-5 h-5" />
                Emotional Tone *
              </label>
              <select
                {...register("emotionalTone")}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {emotionalTones.map((tone) => (
                  <option key={tone} value={tone} className="bg-gray-900">
                    {tone}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="flex items-center gap-2 text-white font-semibold mb-2">
              <Upload className="w-5 h-5" />
              Upload Image (Optional)
            </label>

            {!imagePreview ? (
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-green-500 transition ${
                    isUploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-12 h-12 text-green-400 animate-spin mb-4" />
                      <p className="text-gray-300">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-300 mb-2">
                        Click to upload image
                      </p>
                      <p className="text-gray-500 text-sm">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </>
                  )}
                </label>
              </div>
            ) : (
              <div className="relative w-full h-64 rounded-xl overflow-hidden group">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Privacy and Access Level */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-white font-semibold mb-2">
                <Globe className="w-5 h-5" />
                Privacy *
              </label>
              <select
                {...register("privacy")}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Public" className="bg-gray-900">
                  Public
                </option>
                <option value="Private" className="bg-gray-900">
                  Private
                </option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-white font-semibold mb-2">
                <Lock className="w-5 h-5" />
                Access Level *
              </label>
              <div className="relative">
                <select
                  {...register("accessLevel")}
                  disabled={!isUserPremium}
                  className={`w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    !isUserPremium ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <option value="free" className="bg-gray-900">
                    Free
                  </option>
                  <option value="premium" className="bg-gray-900">
                    Premium
                  </option>
                </select>
                {!isUserPremium && (
                  <div className="mt-2 flex items-center gap-2 text-yellow-400 text-sm">
                    <Crown className="w-4 h-4" />
                    <span>Upgrade to Premium to create paid lessons</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex-1 bg-linear-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Lesson"
              )}
            </button>
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
