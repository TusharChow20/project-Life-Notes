const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />
);

const SkeletonBase = ({ className = "" }) => (
  <div className={`relative overflow-hidden bg-white/5 rounded ${className}`}>
    <Shimmer />
  </div>
);

export const LessonCardSkeleton = () => (
  <div className="rounded-2xl shadow-md overflow-hidden flex flex-col bg-white/5 backdrop-blur-sm p-6">
    <div className="flex items-center justify-between mb-3">
      <SkeletonBase className="h-6 w-20 rounded-full" />
      <SkeletonBase className="h-6 w-24 rounded-full" />
    </div>

    <SkeletonBase className="h-6 w-full mb-2" />
    <SkeletonBase className="h-6 w-3/4 mb-3" />

    <SkeletonBase className="h-4 w-full mb-2" />
    <SkeletonBase className="h-4 w-full mb-2" />
    <SkeletonBase className="h-4 w-2/3 mb-4" />

    <SkeletonBase className="h-5 w-32 mb-4" />

    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
      <SkeletonBase className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <SkeletonBase className="h-4 w-24 mb-2" />
        <SkeletonBase className="h-3 w-20" />
      </div>
    </div>

    <div className="flex items-center justify-between mb-4">
      <SkeletonBase className="h-4 w-12" />
      <SkeletonBase className="h-4 w-12" />
      <SkeletonBase className="h-4 w-12" />
    </div>

    <SkeletonBase className="h-12 w-full rounded-xl" />
  </div>
);

export const LessonDetailsSkeleton = () => (
  <div className="min-h-screen">
    <div className="max-w-4xl mx-auto px-4 py-12">
      <SkeletonBase className="h-6 w-32 mb-8" />

      <div className="backdrop-blur-lg rounded-2xl overflow-hidden mb-8">
        <SkeletonBase className="w-full h-80" />

        <div className="p-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <SkeletonBase className="h-8 w-24 rounded-full" />
            <SkeletonBase className="h-8 w-32 rounded-full" />
            <SkeletonBase className="h-8 w-28 rounded-full" />
          </div>

          <SkeletonBase className="h-10 w-full mb-3" />
          <SkeletonBase className="h-10 w-3/4 mb-6" />

          <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-white/20">
            <SkeletonBase className="h-4 w-32" />
            <SkeletonBase className="h-4 w-32" />
            <SkeletonBase className="h-4 w-20" />
            <SkeletonBase className="h-4 w-24" />
          </div>

          <div className="mb-8">
            {[...Array(6)].map((_, i) => (
              <SkeletonBase key={i} className="h-4 w-full mb-3" />
            ))}
          </div>

          <div className="flex flex-wrap gap-8 mb-8 pb-8 border-b border-white/20">
            <SkeletonBase className="h-8 w-32" />
            <SkeletonBase className="h-8 w-32" />
            <SkeletonBase className="h-8 w-32" />
          </div>

          <div className="flex flex-wrap gap-4">
            <SkeletonBase className="h-12 w-28 rounded-xl" />
            <SkeletonBase className="h-12 w-40 rounded-xl" />
            <SkeletonBase className="h-12 w-28 rounded-xl" />
            <SkeletonBase className="h-12 w-28 rounded-xl" />
          </div>
        </div>
      </div>

      <div className="backdrop-blur-lg rounded-2xl p-8">
        <SkeletonBase className="h-7 w-48 mb-6" />
        <div className="flex items-start gap-6">
          <SkeletonBase className="w-24 h-24 rounded-full" />
          <div className="flex-1">
            <SkeletonBase className="h-6 w-48 mb-2" />
            <SkeletonBase className="h-4 w-32 mb-4" />
            <SkeletonBase className="h-12 w-56 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  </div>
);
