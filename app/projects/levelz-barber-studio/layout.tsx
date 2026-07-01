import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Levelz Barber Studio Website",
  description: "Case study: modern barbershop website with Booksy booking integration, mobile-first design, and local SEO — live at levelzbarberstudio.com.",
};

export default function CaseStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
