"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  BookmarkPlus,
  Eye,
  Calendar,
  Clock,
  Globe,
  Tag,
  Flag,
  Share2,
  Lock,
  ArrowLeft,
  User,
  BookOpen,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import instance from "@/app/AxiosApi/AxiosInstence";
import Image from "next/image";
import Swal from "sweetalert2";
import { X, Loader2 } from "lucide-react";
import { LessonDetailsSkeleton } from "@/Component/Skeletons";

export default function LessonDetailsPage() {
  const { id: lessonId } = useParams();
  const { data: session } = useSession();
  const router = useRouter();

  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [creatorLessonCount, setCreatorLessonCount] = useState(0);

  const reportReasons = [
    "Spam or misleading",
    "Hate speech or harassment",
    "Sexual or inappropriate content",
    "Violence or harmful behavior",
    "Copyright infringement",
    "Other",
  ];

  // Check authentication and redirect to login
  const checkAuthAndRedirect = () => {
    if (!session?.user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please log in to perform this action",
        showCancelButton: true,
        confirmButtonText: "Go to Login",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#10b981",
        cancelButtonColor: "#6b7280",
      }).then((result) => {
        if (result.isConfirmed) {
          const currentUrl = window.location.pathname;
          router.push(`/login?returnUrl=${encodeURIComponent(currentUrl)}`);
        }
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkAuthAndRedirect()) {
      return;
    }

    if (!selectedReason) {
      Swal.fire({
        icon: "error",
        title: "Select a Reason",
        text: "Please select a reason for reporting",
        confirmButtonColor: "#10b981",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await instance.post("/reports", {
        lessonId,
        lessonTitle,
        reporterId: session.user._id || session.user.id,
        reporterName: session.user.name,
        reporterEmail: session.user.email,
        reason: selectedReason,
        description: description.trim(),
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Report Submitted",
          text: "Thank you for helping us keep the community safe. We'll review your report.",
          timer: 3000,
          showConfirmButton: false,
        });
        document.getElementById("report_modal")?.close();

        setSelectedReason("");
        setDescription("");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Submit",
        text:
          error.response?.data?.message ||
          "Failed to submit report. Please try again.",
        confirmButtonColor: "#10b981",
      });
      document.getElementById("report_modal")?.close();
    } finally {
      setIsSubmitting(false);
    }
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: async () => {
      const res = await instance.get(`/publicLesson/${lessonId}`);
      return res.data.lesson;
    },
    enabled: Boolean(lessonId),
  });
  const lessonTitle = data?.title || "Untitled Lesson";

  useEffect(() => {
    const fetchCreatorLessonCount = async () => {
      if (!data?.creatorEmail) return;

      try {
        const response = await instance.get(
          `/publicLesson/count?creatorEmail=${encodeURIComponent(
            data.creatorEmail
          )}`
        );
        setCreatorLessonCount(response.data.count || 0);
      } catch (error) {
        console.error("Failed to fetch creator lesson count:", error);
        setCreatorLessonCount(0);
      }
    };

    if (data?.creatorEmail) {
      fetchCreatorLessonCount();
    }
  }, [data?.creatorEmail]);

  // Fetch like and favorite status
  useEffect(() => {
    const fetchUserInteractions = async () => {
      if (!session?.user?._id && !session?.user?.id) return;

      const userId = session.user._id || session.user.id;

      try {
        // Check if user has liked this lesson
        const likeResponse = await instance.get(
          `/publicLesson/${lessonId}/checkLike`,
          {
            params: { userId },
          }
        );
        setIsLiked(likeResponse.data.isLiked);

        // Check if user has favorited this lesson
        const favoriteResponse = await instance.get(
          `/publicLesson/${lessonId}/checkFavorite`,
          {
            params: { userId },
          }
        );
        setIsFavorited(favoriteResponse.data.isFavorited);
      } catch (error) {
        console.error("Failed to fetch user interactions:", error);
      }
    };

    if (lessonId && session?.user) {
      fetchUserInteractions();
    }
  }, [lessonId, session]);

  const isUserPremium = session?.user?.isPremium === true;
  const isPremiumLesson = data?.accessLevel === "premium";
  const isLocked = isPremiumLesson && !isUserPremium;
  const isCreator =
    session?.user?.email &&
    data?.creatorEmail &&
    session.user.email === data.creatorEmail;

  const calculateReadingTime = (text = "") => {
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const getToneColor = (tone) => {
    const colors = {
      Motivational: "bg-green-100 text-green-700 border-green-300",
      Sad: "bg-blue-100 text-blue-700 border-blue-300",
      Realization: "bg-purple-100 text-purple-700 border-purple-300",
      Gratitude: "bg-yellow-100 text-yellow-700 border-yellow-300",
    };
    return colors[tone] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  const handleLike = async () => {
    if (!checkAuthAndRedirect()) {
      return;
    }

    try {
      const response = await instance.post(`/publicLesson/${lessonId}/like`, {
        email: session.user.email,
        userId: session.user._id || session.user.id,
      });

      if (response.data.success) {
        setIsLiked(!isLiked);
        refetch();
      }
    } catch (error) {
      console.error("Failed to like:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Update",
        text: "Failed to update like status. Please try again.",
        confirmButtonColor: "#10b981",
      });
    }
  };

  const handleFavorite = async () => {
    if (!checkAuthAndRedirect()) {
      return;
    }

    try {
      const response = await instance.post(
        `/publicLesson/${lessonId}/favorite`,
        {
          email: session.user.email,
          userId: session.user._id || session.user.id,
        }
      );

      if (response.data.success) {
        setIsFavorited(!isFavorited);
        refetch();
      }
    } catch (error) {
      console.error("Failed to favorite:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Update",
        text: "Failed to update favorite status. Please try again.",
        confirmButtonColor: "#10b981",
      });
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Lesson?",
      text: "This action cannot be undone. Are you sure you want to delete this lesson?",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await instance.delete(`/publicLesson/${lessonId}`, {
        data: { email: session.user.email },
      });

      if (response.data.success) {
        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Lesson deleted successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
        router.push("/public-lessons");
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to Delete",
          text: response.data.message || "Failed to delete lesson",
          confirmButtonColor: "#10b981",
        });
      }
    } catch (error) {
      console.error("Failed to delete:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Delete",
        text: "Failed to delete lesson. Please try again.",
        confirmButtonColor: "#10b981",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this lesson: ${data?.title}`;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
    };

    window.open(shareUrls[platform], "_blank", "width=600,height=400");
    setShowShareModal(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    Swal.fire({
      icon: "success",
      title: "Copied!",
      text: "Link copied to clipboard!",
      timer: 2000,
      showConfirmButton: false,
    });
    setShowShareModal(false);
  };

  const handleReportClick = () => {
    if (!checkAuthAndRedirect()) {
      return;
    }
    document.getElementById("report_modal")?.showModal();
  };

  if (isLoading) {
    return <LessonDetailsSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 font-medium mb-4">Lesson not found</p>
          <Link
            href="/public-lessons"
            className="text-green-400 hover:text-green-300"
          >
            ← Back to Lessons
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = calculateReadingTime(data.description);
  const randomViews = Math.floor(Math.random() * 10000);

  if (isLocked) {
    return (
      <div className="min-h-screen ">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link
            href="/public-lessons"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Lessons
          </Link>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 backdrop-blur-md bg-black/40 z-10 flex items-center justify-center">
                <div className="text-center p-8 max-w-md">
                  <Lock className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Premium Content
                  </h2>
                  <p className="text-gray-200 mb-6 text-lg">
                    Upgrade to Premium to unlock this exclusive life lesson and
                    gain access to all premium content.
                  </p>
                  <Link
                    href="/pricing"
                    className="inline-block bg-linear-to-r from-yellow-400 to-yellow-500 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-500 hover:to-yellow-600 transition transform hover:scale-105"
                  >
                    ⭐ Upgrade to Premium
                  </Link>
                  <p className="text-gray-300 mt-4 text-sm">
                    Get unlimited access to premium lessons for just $15/month
                  </p>
                </div>
              </div>

              <div className="blur-sm p-8">
                <h1 className="text-4xl font-bold text-white mb-4">
                  {data.title}
                </h1>
                <p className="text-gray-300 leading-relaxed">
                  {data.description?.substring(0, 200)}...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Link
          href="/public-lessons"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Lessons
        </Link>

        {/* Main Content Card */}
        <div className=" backdrop-blur-lg rounded-2xl overflow-hidden mb-8">
          {/* Featured Image */}
          {data.image && (
            <div className="relative w-full h-80">
              <Image
                src={data.image}
                alt={data.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            <div className="flex flex-wrap gap-2 mb-6">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  isPremiumLesson
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {isPremiumLesson ? "⭐ Premium" : "✓ Free"}
              </span>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold border ${getToneColor(
                  data.emotionalTone
                )}`}
              >
                {data.emotionalTone}
              </span>
              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-100 text-purple-700 border border-purple-300 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                {data.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {data.title}
            </h1>

            <div className="flex flex-wrap gap-6 text-gray-300 text-sm mb-8 pb-8 border-b border-white/20">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  Created{" "}
                  {new Date(data.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  Updated{" "}
                  {new Date(data.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>{data.visibility || "Public"}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{readingTime} min read</span>
              </div>
            </div>

            {/* Full Description/Story */}
            <div className="prose prose-invert prose-lg max-w-none mb-8">
              {data.description?.split("\n\n").map((paragraph, index) => (
                <p key={index} className="text-gray-200 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap gap-8 mb-8 pb-8 border-b border-white/20">
              <div className="flex items-center gap-2 text-white">
                <Heart
                  className={`w-6 h-6 ${
                    isLiked ? "fill-red-500 text-red-500" : "text-red-400"
                  }`}
                />
                <span className="text-xl font-semibold">
                  {(data.likesCount || 0).toLocaleString()}
                </span>
                <span className="text-gray-400 text-sm">Likes</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <BookmarkPlus
                  className={`w-6 h-6 ${
                    isFavorited
                      ? "fill-blue-500 text-blue-500"
                      : "text-blue-400"
                  }`}
                />
                <span className="text-xl font-semibold">
                  {(data.favoritesCount || 0).toLocaleString()}
                </span>
                <span className="text-gray-400 text-sm">Favorites</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Eye className="w-6 h-6 text-green-400" />
                <span className="text-xl font-semibold">
                  {randomViews.toLocaleString()}
                </span>
                <span className="text-gray-400 text-sm">Views</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 cursor-pointer
                   px-6 py-3 rounded-xl font-semibold transition transform hover:scale-105 ${
                     isLiked
                       ? "bg-red-500 text-white"
                       : "bg-white/10 text-white hover:bg-white/20"
                   }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                {isLiked ? "Liked" : "Like"}
              </button>

              <button
                onClick={handleFavorite}
                className={`flex items-center gap-2 cursor-pointer
                   px-6 py-3 rounded-xl font-semibold transition transform hover:scale-105 ${
                     isFavorited
                       ? "bg-blue-500 text-white"
                       : "bg-white/10 text-white hover:bg-white/20"
                   }`}
              >
                <BookmarkPlus
                  className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`}
                />
                {isFavorited ? "Saved" : "Save to Favorites"}
              </button>

              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 cursor-pointer
                 px-6 py-3 rounded-xl font-semibold bg-white/10 text-white hover:bg-white/20 transition transform hover:scale-105"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>

              <button
                onClick={handleReportClick}
                className="flex cursor-pointer items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-white/10 text-white hover:bg-red-500/20 hover:text-red-400 transition transform hover:scale-105"
              >
                <Flag className="w-5 h-5" />
                Report
              </button>

              {isCreator && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex cursor-pointer items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Delete
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Author Card */}
        <div className=" border shadow-xl backdrop-blur-lg rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            About the Author
          </h2>
          <div className="flex items-start gap-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white/20">
              <Image
                src={data.creatorPhoto || "https://i.pravatar.cc/150?img=1"}
                alt={data.creatorName || "Author"}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">
                {data.creatorName || "Anonymous"}
              </h3>
              <p className="text-gray-300 mb-4">
                <span className="font-semibold text-green-400">
                  {creatorLessonCount}
                </span>{" "}
                lessons created
              </p>
              <Link
                href={`/profile/${data.creatorId}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition transform hover:scale-105"
              >
                <User className="w-5 h-5" />
                View all lessons by this author
              </Link>
            </div>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <div
              className="bg-gray-900 rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-6">
                Share this lesson
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => handleShare("facebook")}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  Facebook
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition"
                >
                  Twitter
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-800 transition"
                >
                  LinkedIn
                </button>
                <button
                  onClick={() => handleShare("whatsapp")}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
                >
                  WhatsApp
                </button>
              </div>
              <button
                onClick={copyToClipboard}
                className="w-full px-4 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition"
              >
                Copy Link
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full mt-4 px-4 py-3 text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Report Modal */}
        <dialog id="report_modal" className="modal">
          <div className="modal-box bg-gray-900 border border-white/20 max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Flag className="w-6 h-6 text-red-400" />
                Report Lesson
              </h3>

              {/* Close button */}
              <form method="dialog">
                <button className="p-2 hover:bg-white/10 rounded-lg">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </form>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} method="dialog">
              <p className="text-gray-400 mb-4">
                Lesson: <span className="text-white">{lessonTitle}</span>
              </p>

              <div className="space-y-2 mb-4">
                {reportReasons.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center p-3 rounded-xl cursor-pointer ${
                      selectedReason === reason
                        ? "bg-red-500/20 border-2 border-red-500"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="radio radio-error"
                    />
                    <span className="ml-3 text-white">{reason}</span>
                  </label>
                ))}
              </div>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Additional details (optional)"
                rows={4}
                className="textarea textarea-bordered w-full mb-4 bg-gray-800 text-white"
                maxLength={500}
              />

              <div className="modal-action">
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedReason}
                  className="btn btn-error"
                >
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </button>

                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() =>
                    document.getElementById("report_modal")?.close()
                  }
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    </div>
  );
}
