import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sports Analytics Parlay Generator",
  description: "Case study: ML-powered sports betting analytics platform using Random Forest models, real-time ESPN and SportsData.io APIs, and a React frontend.",
};

export default function CaseStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
