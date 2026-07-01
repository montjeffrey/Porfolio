import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Jeffrey Montoya's journey from Electrical Engineering to Solutions Engineering, combining operational expertise with technical innovation.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

