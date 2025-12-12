import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects - Jeffrey Montoya",
  description: "Explore full-stack projects including ML sports analytics, responsive web applications, and automated security tools built by Jeffrey Montoya.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

