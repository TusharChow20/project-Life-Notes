import { FeaturedLessons } from "@/Component/FeaturedLesson";
import HeroSection from "@/Component/HeroSection";
import { MostSavedLessons } from "@/Component/MostSavedLesssons";
import { TopContributors } from "@/Component/TopContributer";
import { WhyLearningMatters } from "@/Component/WhyLearningMatters";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <HeroSection></HeroSection>

      <FeaturedLessons></FeaturedLessons>
      <WhyLearningMatters></WhyLearningMatters>
      <MostSavedLessons></MostSavedLessons>
      <TopContributors></TopContributors>
    </div>
  );
}
