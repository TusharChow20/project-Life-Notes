"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Lottie from "lottie-react";

export default function GlobalLoading() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/lottie/lottiLoading.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="text-center">
        {animationData ? (
          <Lottie
            animationData={animationData}
            loop={true}
            style={{ width: 250, height: 250 }}
          />
        ) : (
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-300 mx-auto"></div>
        )}
        <p className="text-white text-lg font-semibold mt-4">Loading...</p>
      </div>
    </div>
  );
}