"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const featuredProjects = [
  {
    title: "Sports Analytics Parlay Generator",
    tags: ["Live Data", "ML-Powered", "API Connected"],
    description: "A full-stack application using Random Forest algorithms to analyze real-time sports data and generate intelligent betting recommendations with proven accuracy improvements.",
    href: "/projects/sports-analytics",
    type: "primary",
  },
  {
    title: "Levelz Barber Studio",
    tags: ["Mobile-First", "Booksy Integration", "Live Booking"],
    description: "A modern, responsive website with seamless appointment booking integration, improving customer engagement and streamlining business operations.",
    href: "/projects/levelz-barber-studio",
    type: "secondary",
  },
];

export default function FeaturedProjects() {
  return (
    <section className="py-20 px-6 bg-bg-elevated">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-serif text-secondary text-center mb-16"
        >
          Featured Projects
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="relative group bg-bg-dark rounded-2xl p-8 border border-primary/20 hover:border-primary/50 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full border border-primary/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-2xl font-serif text-secondary font-bold mb-4">
                  {project.title}
                </h3>

                <p className="text-secondary/80 mb-6 leading-relaxed">
                  {project.description}
                </p>

                <Link
                  href={project.href}
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold group-hover:gap-4 transition-all duration-300"
                >
                  View Case Study
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

