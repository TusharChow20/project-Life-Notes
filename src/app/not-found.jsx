"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/lottie/lottii404.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {animationData ? (
          <Lottie
            animationData={animationData}
            loop={true}
            style={{
              width: "100%",
              maxWidth: 500,
              height: "auto",
              margin: "0 auto",
            }}
          />
        ) : (
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-green-300 mx-auto mb-8"></div>
        )}

        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-300 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-400 text-lg mb-8">
          Oops! The page you are looking for does not exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-lg hover:from-green-600 hover:to-green-700 transition transform hover:scale-105 shadow-lg"
        >
          <Home className="w-5 h-5" />
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
