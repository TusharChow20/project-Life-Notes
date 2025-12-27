"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Lottie from "lottie-react";

export default function GlobalLoading() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [animationData, setAnimationData] = useState(null);

  // Load Lottie animation once
  useEffect(() => {
    fetch("/lottie/lottiLoading.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  // Trigger loader on route change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="text-center">
        {animationData ? (
          <Lottie
            animationData={animationData}
            loop
            style={{ width: 250, height: 250 }}
          />
        ) : (
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-300 mx-auto" />
        )}
        <p className="text-white text-lg font-semibold mt-4">Loading...</p>
      </div>
    </div>
  );
}
