"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Database, TrendingUp, Users, FileText, DollarSign } from "lucide-react";

export default function CRMIntegrationCaseStudy() {
  return (
    <div className="min-h-screen bg-bg-dark pt-8 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>

          <h1 className="text-5xl md:text-6xl font-serif text-secondary mb-6">
            Law Firm CRM Integration System
          </h1>
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-4 py-2 bg-primary/20 text-primary rounded-full border border-primary/30">
              Automation
            </span>
            <span className="px-4 py-2 bg-secondary/10 text-secondary/80 rounded-full">
              Deployed (5000+ clients)
            </span>
          </div>
          <p className="text-xl text-secondary/80 leading-relaxed">
            Comprehensive data management system integrating multiple CRM/CMS platforms, improving lead quality by 60% and streamlining client communications.
          </p>
        </motion.div>

        {/* Project Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 bg-bg-elevated rounded-2xl p-8 border border-primary/20"
        >
          <h2 className="text-3xl font-serif text-secondary mb-6 flex items-center gap-3">
            <Database className="w-8 h-8 text-primary" />
            Project Overview
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Challenge</h3>
              <p className="text-secondary/80 leading-relaxed">
                Law firm managing 5000+ clients across multiple disconnected systems (Lawmatics, Docketwise) leading to data inconsistencies, duplicate entries, and inefficient workflows.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Solution</h3>
              <p className="text-secondary/80 leading-relaxed">
                Developed a comprehensive integration system that synchronizes data across platforms, automates lead scoring and routing, and streamlines document and financial workflows.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Impact</h3>
              <p className="text-secondary/80 leading-relaxed">
                60% improvement in lead quality, 50% reduction in manual data entry, and seamless integration with financial systems (LawPay/QuickBooks).
              </p>
            </div>
          </div>
        </motion.section>

        {/* Key Features */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-serif text-secondary mb-8 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            Key Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Multi-System Data Synchronization",
                description: "Real-time synchronization between Lawmatics, Docketwise, and custom databases ensuring data consistency across all platforms",
                icon: Database,
                metric: "5000+ clients synced",
              },
              {
                title: "Automated Lead Scoring & Routing",
                description: "Intelligent lead scoring algorithm automatically routes high-quality leads to appropriate attorneys based on case type and expertise",
                icon: Users,
                metric: "60% lead quality improvement",
              },
              {
                title: "Document Digitization Workflow",
                description: "Automated document processing pipeline that extracts, indexes, and stores client documents across all systems",
                icon: FileText,
                metric: "50% reduction in manual entry",
              },
              {
                title: "Financial Integration",
                description: "Seamless integration with LawPay and QuickBooks for automated invoice generation, payment tracking, and financial reporting",
                icon: DollarSign,
                metric: "Real-time financial sync",
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  className="bg-bg-elevated rounded-xl p-6 border border-primary/20"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="w-6 h-6 text-primary" />
                    <h3 className="text-xl font-semibold text-secondary">{feature.title}</h3>
                  </div>
                  <p className="text-secondary/80 leading-relaxed mb-3">{feature.description}</p>
                  <div className="text-sm text-primary font-semibold">{feature.metric}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Technical Stack */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-serif text-secondary mb-6">Technical Stack</h2>
          <div className="flex flex-wrap gap-3">
            {["Lawmatics", "Docketwise", "Python", "REST APIs"].map((tech, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-primary/20 text-primary rounded-full border border-primary/30 font-mono text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

