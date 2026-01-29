import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CarbonViz - Interactive Carbon Footprint & Nature Loss Visualizer",
    template: "%s | CarbonViz",
  },
  description: "Visualize the real-world impact of your lifestyle on nature. Calculate your carbon footprint and see how many trees or ecosystems are needed to restore balance.",
  keywords: ["carbon calculator", "carbon footprint", "nature loss visualizer", "ecosystem restoration", "sustainability", "climate change", "environment", "3d visualization"],
  authors: [{ name: "Nikhil Parmar", url: "https://nikhilp.online" }],
  creator: "Nikhil Parmar",
  metadataBase: new URL("https://nikhilp.online/carbonviz"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nikhilp.online/carbonviz",
    title: "CarbonViz - Interactive Carbon Footprint Visualizer",
    description: "Discover the environmental impact of your daily choices. See your carbon footprint visualized as ecosystem health.",
    siteName: "CarbonViz",
    images: [
      {
        url: "/og-image.jpg", // Make sure to add an OG image later if possible, or use a placeholder
        width: 1200,
        height: 630,
        alt: "CarbonViz Application Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CarbonViz - Interactive Carbon Footprint Visualizer",
    description: "Visualize your carbon footprint and learn how to restore the balance.",
    creator: "@nikhilparmar", // Replace with actual handle if known, otherwise generic
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} ${geistMono.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
