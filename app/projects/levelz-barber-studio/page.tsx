"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Smartphone, Calendar, TrendingUp, Zap } from "lucide-react";
import { useState } from "react";

export default function LevelzBarberStudioCaseStudy() {
  const [selectedView, setSelectedView] = useState<"before" | "after">("before");

  const metrics = [
    { label: "Page Speed", before: "2.8s", after: "0.9s", improvement: "68% faster" },
    { label: "Mobile Score", before: "65", after: "98", improvement: "+33 points" },
    { label: "Accessibility", before: "72", after: "95", improvement: "+23 points" },
    { label: "SEO Score", before: "Page 3", after: "Top 5", improvement: "Improved ranking" },
  ];

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
            Levelz Barber Studio Website
          </h1>
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-4 py-2 bg-primary/20 text-primary rounded-full border border-primary/30">
              Web Development
            </span>
            <span className="px-4 py-2 bg-secondary/10 text-secondary/80 rounded-full">
              Live at levelzbarbershop.com
            </span>
          </div>
          <p className="text-xl text-secondary/80 leading-relaxed">
            Modern barbershop website with integrated booking system, improving customer acquisition and streamlining appointment management for a local business.
          </p>
        </motion.div>

        {/* Project Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 bg-bg-elevated rounded-2xl p-8 border border-primary/20"
        >
          <h2 className="text-3xl font-serif text-secondary mb-6">Project Overview</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Challenge</h3>
              <p className="text-secondary/80 leading-relaxed">
                Local barbershop struggled with phone-based bookings, limited online presence, and inability to showcase services effectively to new customers.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Solution</h3>
              <p className="text-secondary/80 leading-relaxed">
                Built a modern, responsive website with integrated booking system, improving digital presence and streamlining customer interactions.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Impact</h3>
              <p className="text-secondary/80 leading-relaxed">
                40% increase in online bookings within first month, improved Google Business ranking, and reduced phone inquiries by 60%.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Before/After Performance Metrics */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-serif text-secondary mb-8 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            Before/After Transformation
          </h2>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setSelectedView("before")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                selectedView === "before"
                  ? "bg-primary text-bg-dark"
                  : "bg-bg-elevated text-secondary/60 border border-primary/20"
              }`}
            >
              Before
            </button>
            <button
              onClick={() => setSelectedView("after")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                selectedView === "after"
                  ? "bg-primary text-bg-dark"
                  : "bg-bg-elevated text-secondary/60 border border-primary/20"
              }`}
            >
              After
            </button>
          </div>

          {/* Metrics Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metrics.map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: selectedView === "before" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-bg-elevated rounded-xl p-6 border border-primary/20"
              >
                <div className="text-sm text-secondary/60 mb-2">{metric.label}</div>
                <div className="text-3xl font-bold text-primary mb-1">
                  {selectedView === "before" ? metric.before : metric.after}
                </div>
                <div className="text-sm text-secondary/80">{metric.improvement}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Integration Deep Dive */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16 space-y-8"
        >
          <h2 className="text-3xl font-serif text-secondary mb-8 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" />
            Integration Deep Dive
          </h2>

          <div className="bg-bg-elevated rounded-2xl p-8 border border-primary/20 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-secondary mb-3">Booksy API Implementation</h3>
              <p className="text-secondary/80 leading-relaxed mb-4">
                Successfully integrated third-party booking platform while maintaining site performance and security. Custom JavaScript middleware handles authentication, availability checking, and booking confirmation.
              </p>
            </div>

            {/* Code Example */}
            <div className="bg-bg-dark rounded-lg p-6 border border-primary/10">
              <h4 className="text-lg font-semibold text-secondary mb-4">Code Example</h4>
              <pre className="text-sm text-secondary/80 font-mono overflow-x-auto">
{`// Secure API integration with error handling
async function checkAvailability(serviceId, date) {
    try {
        const response = await secureAPICall('/availability', {
            service: serviceId,
            date: formatDate(date),
            location: SHOP_ID
        });
        return processAvailability(response);
    } catch (error) {
        return handleBookingError(error);
    }
}`}
              </pre>
            </div>

            {/* Key Features */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary" />
                Key Features
              </h4>
              <ul className="space-y-3">
                {[
                  "Direct Booksy API integration for real-time availability",
                  "Mobile-first responsive design",
                  "Custom CMS for staff content updates",
                  "SEO optimization improving local search visibility",
                ].map((feature, i) => (
                  <li key={i} className="text-secondary/80 flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

