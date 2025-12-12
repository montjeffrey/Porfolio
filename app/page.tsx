import type { Metadata } from "next";
import Hero from "@/components/Hero";
import AboutIntro from "@/components/AboutIntro";
import SkillsBentoGrid from "@/components/SkillsBentoGrid";
import FeaturedProjects from "@/components/FeaturedProjects";
import BrandStatement from "@/components/BrandStatement";
import BottomCTA from "@/components/BottomCTA";

export const metadata: Metadata = {
  title: "Jeffrey Montoya - Solutions Engineer",
  description: "Solutions Engineer specializing in full-stack development, cloud architecture, and ML-powered applications. Bridging operations and innovation.",
};

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

