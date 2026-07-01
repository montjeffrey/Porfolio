import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Gen Z Mama",
  description: "Case study: trust-first childcare brand website built with Next.js, Tailwind CSS, and Sanity CMS — live at thegenzmama.com.",
};

export default function CaseStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
