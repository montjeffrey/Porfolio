"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Heart, Layout, Palette, ShieldCheck, FileText, Search, Baby } from "lucide-react";

export default function TheGenZMamaCaseStudy() {
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
            The Gen Z Mama
          </h1>
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-4 py-2 bg-primary/20 text-primary rounded-full border border-primary/30">
              Web Development
            </span>
            <a
              href="https://thegenzmama.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary/80 rounded-full hover:bg-secondary/20 hover:text-secondary transition-colors"
            >
              Live at thegenzmama.com
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <p className="text-xl text-secondary/80 leading-relaxed">
            A warm, trust-first brand website for a licensed childcare provider in Wharton, NJ — pairing a playful, family-feel design with a Sanity-powered blog and a streamlined inquiry flow that turns visiting parents into booked families.
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
                Choosing childcare is one of the highest-trust decisions a parent makes, and word-of-mouth alone caps how many families a great provider can reach. The Gen Z Mama needed an online home that could do what a text thread between moms can&apos;t: prove credentials up front, explain care options and transparent pricing, showcase personality, and make reaching out feel effortless — all without losing the warm, personal feel that sets her care apart.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Solution</h3>
              <p className="text-secondary/80 leading-relaxed">
                Designed and built a custom Next.js site with a hand-crafted, storybook-warm visual identity — custom Tailwind theme, handwritten display type, and terracotta-and-warm-brown palette. The site presents both care models (facility-based care and in-home travel care within 20 miles of Dover, NJ), transparent pricing packages, credential badges (CPR, First Aid/AED, state licensed, insured, background checked, ECE degree), parent testimonials, and an inquiry form for booking. A Sanity CMS-backed &ldquo;Mommy Blog&rdquo; lets the owner publish parenting content herself — no developer required.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Impact</h3>
              <p className="text-secondary/80 leading-relaxed">
                The business now has a professional, self-serve front door: parents can vet credentials, compare care packages, and submit an inquiry in one visit instead of a back-and-forth phone tag. The blog gives the brand an organic-search surface for local parenting queries, and the CMS means fresh content ships weekly without any code changes.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Architecture & CMS Deep Dive */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16 space-y-8"
        >
          <h2 className="text-3xl font-serif text-secondary mb-8 flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            Content Platform Deep Dive
          </h2>

          <div className="bg-bg-elevated rounded-2xl p-8 border border-primary/20 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-secondary mb-3">Sanity CMS Integration</h3>
              <p className="text-secondary/80 leading-relaxed mb-4">
                Blog posts, imagery, and testimonials live in Sanity&apos;s hosted content lake, so the owner writes and publishes from a friendly editor while the Next.js frontend pulls structured content and serves optimized images from Sanity&apos;s CDN.
              </p>
            </div>

            {/* Code Example */}
            <div className="bg-bg-dark rounded-lg p-6 border border-primary/10">
              <h4 className="text-lg font-semibold text-secondary mb-4">Code Example</h4>
              <pre className="text-sm text-secondary/80 font-mono overflow-x-auto">
{`// Fetch published blog posts from Sanity
const POSTS_QUERY = \`*[_type == "post" && defined(slug.current)]
  | order(publishedAt desc) {
    title, slug, excerpt, mainImage, publishedAt
  }\`;

export async function getBlogPosts() {
  return sanityClient.fetch(POSTS_QUERY);
}`}
              </pre>
            </div>

            {/* Key Features */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                <Layout className="w-5 h-5 text-primary" />
                Key Features
              </h4>
              <ul className="space-y-3">
                {[
                  "Sanity CMS blog (“Mommy Blog”) the owner updates herself — parenting tips, activity ideas, and product reviews",
                  "Two care models presented side-by-side: facility care and in-home travel care with clear service-area boundaries",
                  "Transparent pricing and package comparison to pre-qualify inquiries",
                  "Credential and trust badges: CPR, First Aid/AED, state licensed, insured, background checked, ECE degree",
                  "Parent testimonial section for social proof",
                  "Inquiry/booking form so new families can reach out in under a minute",
                  "Custom Tailwind design system with handwritten display type and a warm, personal palette",
                  "Optimized images served through Sanity's CDN with Next.js image handling",
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

        {/* Design & Trust Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-serif text-secondary mb-8 flex items-center gap-3">
            <Palette className="w-8 h-8 text-primary" />
            Design Built Around Trust
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Brand & Design */}
            <div className="bg-bg-elevated rounded-2xl p-8 border border-primary/20">
              <h3 className="text-2xl font-serif text-secondary mb-6 flex items-center gap-2">
                <Heart className="w-6 h-6 text-primary" />
                Brand Personality
              </h3>
              <ul className="space-y-3">
                {[
                  { label: "Tagline-first hero", desc: "“Energetic, Fun Care that Feels Like Family” sets the tone before a single credential" },
                  { label: "Handwritten typography", desc: "Custom display font gives the site a personal, scrapbook-like warmth" },
                  { label: "Warm palette", desc: "Terracotta and warm-brown tones instead of clinical daycare blue" },
                  { label: "Playful motion", desc: "Subtle hover and scale interactions that feel friendly, not flashy" },
                ].map((item, i) => (
                  <li key={i} className="border-b border-primary/10 pb-3 last:border-0">
                    <div className="text-secondary font-semibold mb-1">{item.label}</div>
                    <p className="text-secondary/60 text-sm">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust Architecture */}
            <div className="bg-bg-elevated rounded-2xl p-8 border border-primary/20">
              <h3 className="text-2xl font-serif text-secondary mb-6 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-primary" />
                Trust Architecture
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-secondary/60 text-sm mb-1 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Credentials Up Front
                  </div>
                  <div className="text-secondary">
                    Licensing, insurance, CPR/First Aid, background check, and ECE degree surfaced on the first screen parents see
                  </div>
                </div>
                <div>
                  <div className="text-secondary/60 text-sm mb-1 flex items-center gap-2">
                    <Baby className="w-4 h-4" />
                    Clear Care Options
                  </div>
                  <div className="text-secondary">
                    Facility care vs. in-home travel care explained plainly, with pricing parents can compare before ever reaching out
                  </div>
                </div>
                <div>
                  <div className="text-secondary/60 text-sm mb-1 flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Local SEO Foundation
                  </div>
                  <div className="text-secondary">
                    Structured pages and an active blog targeting Wharton / Dover, NJ childcare searches
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
