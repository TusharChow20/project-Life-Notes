import instance from "@/app/AxiosApi/AxiosInstence";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const { Crown, X, Upload, Loader2, BookOpen } = require("lucide-react");
const { default: Image } = require("next/image");

export function EditLessonModal({ lesson, onClose, onSuccess }) {
  const { data: session } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(lesson.image || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: lesson.title,
      description: lesson.description,
      category: lesson.category,
      emotionalTone: lesson.emotionalTone,
      image: lesson.image || "",
      imagePublicId: lesson.imagePublicId || "",
      privacy: lesson.visibility,
      accessLevel: lesson.accessLevel,
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

    setIsUploading(true);

    try {
      // Delete old image if exists
      if (watchImagePublicId) {
        await instance.delete(
          `/delete-image/${encodeURIComponent(watchImagePublicId)}`
        );
      }

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
    if (data.accessLevel === "premium" && !isUserPremium) {
      Swal.fire({
        icon: "warning",
        title: "Premium Required",
        text: "You need Premium to create paid lessons",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData = {
        title: data.title.trim(),
        description: data.description.trim(),
        category: data.category,
        emotionalTone: data.emotionalTone,
        image: data.image || null,
        imagePublicId: data.imagePublicId || null,
        visibility: data.privacy,
        accessLevel: data.accessLevel,
      };

      await instance.put(`/publicLesson/${lesson._id}`, updateData);

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Lesson has been updated successfully",
        timer: 2000,
        showConfirmButton: false,
      });

      onSuccess();
    } catch (error) {
      console.error("Error updating lesson:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.message || "Failed to update lesson",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-white/20 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Edit Lesson</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-white font-semibold mb-2">
              <BookOpen className="w-5 h-5" />
              Lesson Title *
            </label>
            <input
              {...register("title", { required: "Title is required" })}
              type="text"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              maxLength={100}
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-white font-semibold mb-2">
              Full Description *
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
                minLength: { value: 50, message: "Min 50 characters" },
              })}
              rows={8}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category & Tone */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-white font-semibold mb-2 block">
                Category *
              </label>
              <select
                {...register("category")}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Personal Growth">Personal Growth</option>
                <option value="Career">Career</option>
                <option value="Relationships">Relationships</option>
                <option value="Mindset">Mindset</option>
                <option value="Mistakes Learned">Mistakes Learned</option>
              </select>
            </div>

            <div>
              <label className="text-white font-semibold mb-2 block">
                Emotional Tone *
              </label>
              <select
                {...register("emotionalTone")}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Motivational">Motivational</option>
                <option value="Sad">Sad</option>
                <option value="Realization">Realization</option>
                <option value="Gratitude">Gratitude</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-white font-semibold mb-2 block">
              Update Image (Optional)
            </label>

            {!imagePreview ? (
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="edit-image-upload"
                />
                <label
                  htmlFor="edit-image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-green-500 transition"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-8 h-8 text-green-400 animate-spin mb-2" />
                      <p className="text-gray-300">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-gray-300">Click to upload new image</p>
                    </>
                  )}
                </label>
              </div>
            ) : (
              <div className="relative w-full h-48 rounded-xl overflow-hidden group">
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

          {/* Privacy & Access */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-white font-semibold mb-2 block">
                Privacy *
              </label>
              <select
                {...register("privacy")}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            </div>

            <div>
              <label className="text-white font-semibold mb-2 block">
                Access Level *
              </label>
              <select
                {...register("accessLevel")}
                disabled={!isUserPremium}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
              {!isUserPremium && (
                <p className="text-yellow-400 text-sm mt-2 flex items-center gap-1">
                  <Crown className="w-4 h-4" />
                  Premium required for paid lessons
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Lesson"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
