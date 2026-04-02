import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Skoun.ma — L'immobilier marocain, simplifié",
  description: "Des milliers d'annonces immobilières gratuites au Maroc, sans frais d'agence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${geist.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
