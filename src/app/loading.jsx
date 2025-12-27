"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";

export default function Loading() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/lottie/lottiLoading.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50">
      <div className="text-center">
        {animationData ? (
          <Lottie
            animationData={animationData}
            loop={true}
            style={{ width: 300, height: 300 }}
          />
        ) : (
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-300 mx-auto"></div>
        )}
        <h2 className="text-2xl font-bold text-white mt-4">Loading...</h2>
        <p className="text-gray-400 mt-2">
          Please wait while we prepare your content
        </p>
      </div>
    </div>
  );
}
