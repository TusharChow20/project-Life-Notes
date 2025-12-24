"use client";

import { useState } from "react";
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
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import instance from "@/app/AxiosApi/AxiosInstence";
import Image from "next/image";

export default function LessonDetailsPage() {
  const { id: lessonId } = useParams();
  const { data: session } = useSession();

  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: async () => {
      const res = await instance.get(`/publicLesson/${lessonId}`);
      return res.data.lesson;
    },
    enabled: Boolean(lessonId),
  });

  const isUserPremium = session?.user?.isPremium === true;
  const isPremiumLesson = data?.accessLevel === "premium";
  const isLocked = isPremiumLesson && !isUserPremium;

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading lesson...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Lesson not found
      </div>
    );
  }

  const readingTime = calculateReadingTime(data.description);

  if (isLocked) {
    return (
      <div className="min-h-screen  text-white p-8">
        <Link href="/public-lessons" className="flex items-center gap-2 mb-6">
          <ArrowLeft /> Back to Lessons
        </Link>

        <div className="bg-black/50 p-12 rounded-xl text-center">
          <Lock className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
          <h2 className="text-3xl font-bold mb-4">Premium Content</h2>
          <p className="text-gray-300 mb-6">
            Upgrade to Premium to unlock this lesson.
          </p>
          <Link
            href="/pricing"
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold"
          >
            Upgrade to Premium
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen  text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <Link
          href="/public-lessons"
          className="flex items-center gap-2 mb-6 text-gray-300 hover:text-white"
        >
          <ArrowLeft /> Back to Lessons
        </Link>

        {/* Image */}
        {data.image && (
          <div className="relative w-full h-80 mb-8">
            <Image
              src={data.image}
              alt={data.title}
              fill
              className="object-cover rounded-xl"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-green-500 text-sm">
            {data.accessLevel === "premium" ? "⭐ Premium" : "✓ Free"}
          </span>
          <span
            className={`px-3 py-1 rounded-full border text-sm ${getToneColor(
              data.emotionalTone
            )}`}
          >
            {data.emotionalTone}
          </span>
          <span className="px-3 py-1 rounded-full bg-purple-600 text-sm flex items-center gap-1">
            <Tag size={14} /> {data.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-6">{data.title}</h1>

        {/* Meta */}
        <div className="flex flex-wrap gap-6 text-gray-300 text-sm mb-8">
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {new Date(data.createdAt).toDateString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> {readingTime} min read
          </span>
          <span className="flex items-center gap-1">
            <Globe size={14} /> {data.visibility}
          </span>
        </div>

        {/* Description */}
        <div className="space-y-4 text-gray-200 mb-10">
          {data.description.split("\n\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* Stats */}
        <div className="flex gap-8 mb-10">
          <div className="flex items-center gap-2">
            <Heart className="text-red-400" />
            {data.likesCount}
          </div>
          <div className="flex items-center gap-2">
            <BookmarkPlus className="text-blue-400" />
            {data.favoritesCount}
          </div>
          <div className="flex items-center gap-2">
            <Eye className="text-green-400" />
            {data.commentsCount}
          </div>
        </div>

        {/* Author */}
        <div className="bg-white/10 p-6 rounded-xl flex gap-6">
          <Image
            width={20}
            height={20}
            src={data.creatorPhoto}
            alt={data.creatorName}
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h3 className="text-xl font-bold">{data.creatorName}</h3>
            <p className="text-gray-300">{data.creatorEmail}</p>
            <Link
              href={`/profile/${data.creatorId}`}
              className="inline-flex items-center gap-2 mt-3 text-green-400"
            >
              <User size={16} /> View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
