import { FeaturedLessons } from "@/Component/FeaturedLesson";
import HeroSection from "@/Component/HeroSection";
import { MostSavedLessons } from "@/Component/MostSavedLessons";
import { TopContributors } from "@/Component/TopContributors";
import { WhyLearningMatters } from "@/Component/WhyLearningMatters";

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
