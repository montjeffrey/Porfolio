"use client";

import { Cloud, Shield, Code, BarChart3 } from "lucide-react";
import { EvervaultBackground } from "@/components/ui/evervault-background";
import { ScrollScene, ParallaxLayer, ProgressReveal } from "@/lib/parallax/scroll-scene";

const skills = [
  {
    title: "Cloud & Infrastructure",
    icon: Cloud,
    description: "Building secure, scalable cloud architectures with hands-on experience in VPC configuration, DNS management, and virtual infrastructure deployment. Currently pursuing AWS Cloud Practitioner and Azure Fundamentals certifications.",
    emoji: "🌩️",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    title: "Security & Compliance",
    icon: Shield,
    description: "Implementing security-first development practices with experience in network analysis using Wireshark, vulnerability assessment frameworks, and automated security testing suites.",
    emoji: "🛡️",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    title: "Full-Stack Development",
    icon: Code,
    description: "Creating responsive web applications and data-driven solutions. From CRM integrations to ML-powered analytics, I build tools that solve real business problems.",
    emoji: "💻",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    title: "Operations & Analytics",
    icon: BarChart3,
    description: "Leveraging experience with Salesforce, Lawmatics, and custom automation to streamline operations. Skilled in data cleaning, validation, and building intelligent workflows that save time and reduce errors.",
    emoji: "📊",
    gradient: "from-primary/20 to-primary/5",
  },
];

// Skill Card component - glassmorphism effect that reveals background effect on hover
const SkillCard = ({
  skill,
  index,
  Icon
}: {
  skill: typeof skills[0];
  index: number;
  Icon: typeof Cloud;
}) => {
  return (
    <div
      className="relative group rounded-2xl p-8 border transition-all duration-300 overflow-hidden
        backdrop-blur-xl bg-bg-elevated/60
        border-primary/30 hover:border-primary/60
        hover:bg-bg-elevated/40 hover:backdrop-blur-2xl md:hover:scale-105 md:hover:-translate-y-2
        active:scale-95 transition-transform
        shadow-lg shadow-primary/10 hover:shadow-primary/20"
    >
      {/* Glassmorphism overlay for depth */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

      {/* Content layer */}
      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-4">
          <div className="text-4xl">{skill.emoji}</div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Icon className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-serif text-secondary font-bold">
                {skill.title}
              </h3>
            </div>
            <p className="text-secondary/80 leading-relaxed">
              {skill.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SkillsBentoGrid() {
  return (
    <section id="act-2" className="relative py-20 px-6 bg-bg-dark overflow-hidden min-h-[800px] group/section">
      <ScrollScene>
        {/* Evervault background effect - covers entire section, drifting at mid depth */}
        <ParallaxLayer depth="mid" className="absolute -inset-[15%]">
          <EvervaultBackground className="rounded-none" radius={450} />
        </ParallaxLayer>

        {/* Top Gradient Blend */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-bg-dark to-transparent z-10 pointer-events-none" />

        {/* Content wrapper - allows mouse events to pass through to background */}
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex justify-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-serif text-secondary text-center relative z-20
                backdrop-blur-xl bg-bg-elevated/60 rounded-2xl py-4 px-8
                border border-primary/30 shadow-lg shadow-primary/10
                hover:border-primary/60 hover:bg-bg-elevated/40 hover:backdrop-blur-2xl
                transition-all duration-300"
            >
              Skills Snapshot
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-20">
            {skills.map((skill, index) => {
              const Icon = skill.icon;
              const start = 0.15 + index * 0.06;
              return (
                <ProgressReveal key={skill.title} start={start} end={start + 0.25}>
                  <SkillCard skill={skill} index={index} Icon={Icon} />
                </ProgressReveal>
              );
            })}
          </div>
        </div>
      </ScrollScene>
    </section>
  );
}
