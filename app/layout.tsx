import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = "https://montjeffrey.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jeffrey Montoya - Solutions Engineer",
    template: "%s - Jeffrey Montoya",
  },
  description: "Solutions Engineer specializing in full-stack development, cloud architecture, and ML-powered applications. Bridging operations and innovation.",
  keywords: ["Solutions Engineer", "Full-Stack Developer", "Cloud Architecture", "Machine Learning", "Web Development", "Jeffrey Montoya"],
  authors: [{ name: "Jeffrey Montoya", url: siteUrl }],
  creator: "Jeffrey Montoya",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Jeffrey Montoya - Solutions Engineer",
    title: "Jeffrey Montoya - Solutions Engineer",
    description: "Solutions Engineer specializing in full-stack development, cloud architecture, and ML-powered applications. Bridging operations and innovation.",
    images: [
      {
        url: "/Photos/Portfolio-picture.jpg",
        width: 864,
        height: 1088,
        alt: "Jeffrey Montoya - Solutions Engineer",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Jeffrey Montoya - Solutions Engineer",
    description: "Solutions Engineer specializing in full-stack development, cloud architecture, and ML-powered applications.",
    images: ["/Photos/Portfolio-picture.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0D0D0D",
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jeffrey Montoya",
  jobTitle: "Solutions Engineer",
  url: siteUrl,
  email: "mailto:montjeffrey@gmail.com",
  sameAs: [
    "https://github.com/montjeffrey",
    "https://linkedin.com/in/montjeffrey",
  ],
  knowsAbout: [
    "Full-Stack Development",
    "Cloud Architecture",
    "Machine Learning",
    "Security & Compliance",
    "CRM Automation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ErrorBoundary>
          <Navbar />
          <main className="min-h-screen pt-16">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  );
}
