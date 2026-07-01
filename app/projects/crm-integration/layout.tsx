import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Law Firm CRM Integration System",
  description: "Case study: multi-platform CRM/CMS integration for a law firm serving 5000+ clients, improving lead quality by 60%.",
};

export default function CaseStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
