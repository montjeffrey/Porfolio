import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Automated Security Assessment Suite",
  description: "Case study: Python security testing framework automating pentesting workflows with CVSS scoring and stakeholder-ready reporting.",
};

export default function CaseStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
