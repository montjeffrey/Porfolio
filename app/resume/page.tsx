"use client";

import { motion } from "framer-motion";
import { FileText, Download, Eye, Briefcase, Code2, Newspaper } from "lucide-react";
import { useState } from "react";

const resumeTypes = [
  {
    id: "technical",
    title: "Technical Resume",
    description: "For: Software Development, Cloud Engineering, DevOps roles",
    highlights: [
      "Programming projects",
      "Technical certifications",
      "ML/AI experience",
    ],
    icon: Code2,
    color: "text-blue-400",
  },
  {
    id: "public-info",
    title: "Public Information Specialist Resume",
    description: "For: Digital Communications, Content Management roles",
    highlights: [
      "CMS experience",
      "Public communication",
      "Document management",
    ],
    icon: Newspaper,
    color: "text-green-400",
  },
  {
    id: "solutions-engineer",
    title: "Solutions Engineer Resume",
    description: "For: Hybrid technical/business roles",
    highlights: [
      "Operational experience",
      "Technical skills",
      "Business impact",
    ],
    icon: Briefcase,
    color: "text-primary",
  },
];

const coreCompetencies = [
  "Problem-Solving: Engineering approach to complex challenges",
  "Communication: Bilingual, technical writing, public speaking",
  "Leadership: Team management, mentorship, cross-functional collaboration",
  "Technical Skills: Full-stack development, cloud platforms, data analysis",
  "Business Acumen: CRM management, process optimization, ROI focus",
];

export default function ResumeHubPage() {
  const [selectedResume, setSelectedResume] = useState<string | null>(null);

  const handleDownload = (resumeId: string, action: "view" | "download") => {
    // Placeholder - in production, these would link to actual PDF files
    console.log(`${action} ${resumeId} resume`);
    // Example implementation:
    // if (action === "download") {
    //   window.location.href = `/resumes/${resumeId}.pdf`;
    // } else {
    //   window.open(`/resumes/${resumeId}.pdf`, "_blank");
    // }
  };

  return (
    <div className="min-h-screen bg-bg-dark pt-8 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-serif text-secondary mb-6">
            Resume Hub
          </h1>
          <p className="text-xl text-secondary/80 max-w-3xl mx-auto leading-relaxed">
            Tailored Resumes for Different Opportunities
          </p>
          <p className="text-lg text-secondary/60 max-w-2xl mx-auto mt-4">
            I maintain specialized versions of my resume to best match different role requirements. Select the version that aligns with your needs:
          </p>
        </motion.div>

        {/* Resume Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {resumeTypes.map((resume, index) => {
            const Icon = resume.icon;
            return (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-bg-elevated rounded-2xl p-8 border border-primary/20 hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <Icon className={`w-10 h-10 ${resume.color}`} />
                  <h2 className="text-2xl font-serif text-secondary font-bold">
                    {resume.title}
                  </h2>
                </div>

                <p className="text-secondary/80 mb-6 leading-relaxed">
                  {resume.description}
                </p>

                <div className="mb-6">
                  <h3 className="text-secondary font-semibold mb-3">Highlights:</h3>
                  <ul className="space-y-2">
                    {resume.highlights.map((highlight, i) => (
                      <li key={i} className="text-secondary/70 text-sm flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleDownload(resume.id, "view")}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-transparent border border-primary/30 hover:border-primary text-secondary rounded-lg font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View PDF
                  </button>
                  <button
                    onClick={() => handleDownload(resume.id, "download")}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary/90 text-bg-dark rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Core Competencies */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-bg-elevated rounded-2xl p-8 md:p-12 border border-primary/20 mb-12"
        >
          <h2 className="text-3xl font-serif text-secondary mb-8 flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            Core Competencies Across All Roles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coreCompetencies.map((competency, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span className="text-secondary/80 leading-relaxed">{competency}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-primary/20">
            <p className="text-secondary/80 leading-relaxed mb-4">
              <strong className="text-secondary">Need a custom version?</strong>{" "}
              <a
                href="/contact"
                className="text-primary hover:text-primary/80 transition-colors underline"
              >
                Contact me
              </a>{" "}
              for a tailored resume highlighting specific experiences relevant to your opportunity.
            </p>
          </div>
        </motion.section>

        {/* Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-secondary/60 text-lg mb-6">
            All resumes are available in PDF format and can be downloaded or viewed directly in your browser.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-bg-dark rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25"
          >
            Request Custom Resume
          </a>
        </motion.div>
      </div>
    </div>
  );
}

