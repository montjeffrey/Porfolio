"use client";

import { motion } from "framer-motion";
import { Cloud, Shield, Code, BarChart3 } from "lucide-react";
import { EvervaultBackground } from "@/components/ui/evervault-background";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative group rounded-2xl p-8 border transition-all duration-300 overflow-hidden
        backdrop-blur-xl bg-bg-elevated/60
        border-primary/30 hover:border-primary/60
        hover:bg-bg-elevated/40 hover:backdrop-blur-2xl
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
    </motion.div>
  );
};

export default function SkillsBentoGrid() {
  return (
    <section className="relative py-20 px-6 bg-bg-dark overflow-hidden min-h-[800px] group/section">
      {/* Evervault background effect - covers entire section */}
      <EvervaultBackground className="rounded-none" radius={450} />
      
      {/* Content wrapper - allows mouse events to pass through to background */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex justify-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-serif text-secondary text-center relative z-20 
              backdrop-blur-xl bg-bg-elevated/60 rounded-2xl py-4 px-8
              border border-primary/30 shadow-lg shadow-primary/10
              hover:border-primary/60 hover:bg-bg-elevated/40 hover:backdrop-blur-2xl
              transition-all duration-300"
          >
            Skills Snapshot
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-20">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <SkillCard key={skill.title} skill={skill} index={index} Icon={Icon} />
            );
          })}
        </div>
      </div>
    </section>
  );
}

