import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Jeffrey Montoya",
  description: "Connect with Jeffrey Montoya for full-stack development, cloud solutions, or technical consulting. Based in Dover, NJ, open to remote opportunities.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

