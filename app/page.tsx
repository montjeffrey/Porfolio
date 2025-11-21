import Hero from "@/components/Hero";
import SkillsBentoGrid from "@/components/SkillsBentoGrid";
import FeaturedProjects from "@/components/FeaturedProjects";
import BrandStatement from "@/components/BrandStatement";
import BottomCTA from "@/components/BottomCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <SkillsBentoGrid />
      <FeaturedProjects />
      <BrandStatement />
      <BottomCTA />
    </>
  );
}

