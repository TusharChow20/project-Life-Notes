"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Lottie from "lottie-react";

import "swiper/css";
import "swiper/css/bundle";
import "swiper/css/pagination";

export default function HeroSection() {
  const slides = [
    {
      title: "Grow Through Life Lessons",
      desc: "Capture meaningful experiences and grow with wisdom.",
      animationPath: "/lottie/slide1.json",
    },
    {
      title: "Track Your Personal Growth",
      desc: "Reflect, learn, and improve every single day.",
      animationPath: "/lottie/slide2.json",
    },
    {
      title: "Share Wisdom With Others",
      desc: "Inspire people by sharing lessons from your journey.",
      animationPath: "/lottie/slide3.json",
    },
  ];

  return (
    <section className="min-h-screen lg:min-h-[60vh] text-white ">
      <div className="max-w-7xl mx-auto px-6 py-2 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Lottie Section - Shows first on mobile, second on desktop */}
        <div className="relative w-full order-1 lg:order-2">
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
            className="w-full h-[350px] md:h-[450px] lg:h-[500px]"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <Lottie
                    path={slide.animationPath}
                    loop
                    autoplay
                    className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80"
                  />

                  <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mt-4 lg:mt-6">
                    {slide.title}
                  </h3>
                  <p className="text-xs md:text-sm text-green-300 mt-2 max-w-sm px-4">
                    {slide.desc}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="space-y-4 lg:space-y-6 text-center lg:text-left order-2 lg:order-1">
          <span className="inline-block px-4 py-1 rounded-full border border-green-400/40 text-green-400 text-sm">
            Digital Life Lessons 🌿
          </span>

          <h1 className="text-2xl md:text-4xl xl:text-5xl font-bold leading-tight">
            Turn Life Into <span className="text-green-400">Lessons</span>,
            <br />
            Lessons Into Growth
          </h1>

          <p className="text-green-300 max-w-xl mx-auto lg:mx-0 text-sm md:text-base">
            Create, organize, and share life lessons. Track your growth and
            explore wisdom from others.
          </p>

          <div className="flex gap-4 pt-2 lg:pt-4 justify-center lg:justify-start">
            <button
              onClick={() => {
                document
                  .getElementById("featured-lesson")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-4 lg:px-6 py-2 lg:py-3 rounded-xl bg-green-500 hover:bg-green-600 font-semibold text-green-950"
            >
              Get Started
            </button>

            <button className="px-4 lg:px-6 py-2 lg:py-3 rounded-xl border border-green-400/40 hover:bg-green-400/10 text-sm lg:text-base">
              Explore Lessons
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
