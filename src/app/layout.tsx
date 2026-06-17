import type { Metadata } from "next";
import { Inter, Outfit, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Outfit({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const outfit = Inter({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "StreamStellar — Turn Products Into Experiences",
  description:
    "Transform your product catalog into interactive 3D experiences, digital twins, and configurators designed for modern commerce.",
  keywords: ["3D experiences", "product visualization", "CGI", "WebGL", "digital twins", "configurators"],
  openGraph: {
    title: "StreamStellar — Turn Products Into Experiences",
    description: "Interactive 3D product experiences for modern commerce.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${instrumentSerif.variable} scroll-smooth`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="page-beam fixed inset-0 pointer-events-none" aria-hidden />
        {children}
      </body>
    </html>
  );
}
