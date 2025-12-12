import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume Hub - Jeffrey Montoya",
  description: "Download tailored resumes for different opportunities: Technical Resume, Public Information Specialist Resume, or Solutions Engineer Resume.",
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

