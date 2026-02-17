import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});



export const metadata: Metadata = {
  title: {
    default: "CarbonViz - Interactive Carbon Footprint & Nature Loss Visualizer",
    template: "%s | CarbonViz",
  },
  description: "Visualize the real-world impact of your lifestyle on nature. Calculate your carbon footprint and see how many trees or ecosystems are needed to restore balance.",
  keywords: ["carbon calculator", "carbon footprint", "nature loss visualizer", "ecosystem restoration", "sustainability", "climate change", "environment", "3d visualization"],
  authors: [{ name: "Nikhil Parmar", url: "https://www.nikhilp.online" }],
  creator: "Nikhil Parmar",
  metadataBase: new URL("https://www.nikhilp.online/carbonviz"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.nikhilp.online/carbonviz",
    title: "CarbonViz - Interactive Carbon Footprint Visualizer",
    description: "Discover the environmental impact of your daily choices. See your carbon footprint visualized as ecosystem health.",
    siteName: "CarbonViz",
    images: [
      {
        url: "/carbonviz/icon.svg", // Make sure to add an OG image later if possible, or use a placeholder
        width: 1200,
        height: 1200,
        alt: "CarbonViz Application Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CarbonViz - Interactive Carbon Footprint Visualizer",
    description: "Visualize your carbon footprint and learn how to restore the balance.",
    creator: "@scientificsaas", // Replace with actual handle if known, otherwise generic
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
        className={`${bricolage.variable} antialiased font-sans`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
