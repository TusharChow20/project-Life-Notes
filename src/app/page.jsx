import { FeaturedLessons } from "@/Component/FeaturedLesson";
import HeroSection from "@/Component/HeroSection";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <HeroSection></HeroSection>

      <FeaturedLessons></FeaturedLessons>
    </div>
  );
}
