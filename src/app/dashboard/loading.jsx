"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";

export default function DashboardLoading() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/lottie/lottiLoading.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
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
        <h2 className="text-2xl font-bold text-white mt-4">Loading Dashboard...</h2>
      </div>
    </div>
  );
}