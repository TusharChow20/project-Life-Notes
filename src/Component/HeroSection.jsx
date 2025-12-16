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
    <section className="max-h-[60vh] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="inline-block px-4 py-1 rounded-full border border-green-400/40 text-green-400 text-sm">
            Digital Life Lessons 🌿
          </span>

          <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold leading-tight">
            Turn Life Into <span className="text-green-400">Lessons</span>,
            <br />
            Lessons Into Growth
          </h1>

          <p className="text-green-300 max-w-xl">
            Create, organize, and share life lessons. Track your growth and
            explore wisdom from others.
          </p>

          <div className="flex gap-4 pt-4">
            <button className="px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 font-semibold text-green-950">
              Get Started
            </button>
            <button className="px-6 py-3 rounded-xl border border-green-400/40 hover:bg-green-400/10">
              Explore Lessons
            </button>
          </div>
        </div>
        <div className="relative">
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
            className="w-full"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="h-105 flex flex-col items-center justify-center text-center">
                  <Lottie
                    path={slide.animationPath}
                    loop
                    autoplay
                    className="w-75 h-75"
                  />

                  <h3 className="text-2xl font-semibold mt-6">{slide.title}</h3>
                  <p className="text-sm text-green-300 mt-2 max-w-sm">
                    {slide.desc}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
