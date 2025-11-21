"use client";

import { motion } from "framer-motion";
import { Cloud, Shield, Code, BarChart3 } from "lucide-react";

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

export default function SkillsBentoGrid() {
  return (
    <section className="py-20 px-6 bg-bg-dark">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-serif text-secondary text-center mb-16"
        >
          Skills Snapshot
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="relative group bg-bg-elevated rounded-2xl p-8 border border-primary/20 hover:border-primary/50 transition-all duration-300 overflow-hidden"
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${skill.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Content */}
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

                {/* Hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-primary/5 blur-xl" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

