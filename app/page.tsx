import Hero from "@/components/Hero";
import AboutIntro from "@/components/AboutIntro";
import SkillsBentoGrid from "@/components/SkillsBentoGrid";
import FeaturedProjects from "@/components/FeaturedProjects";
import BrandStatement from "@/components/BrandStatement";
import BottomCTA from "@/components/BottomCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutIntro />
      <SkillsBentoGrid />
      <FeaturedProjects />
      <BrandStatement />
      <BottomCTA />
    </>
  );
}

