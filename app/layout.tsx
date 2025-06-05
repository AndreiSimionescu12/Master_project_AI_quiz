import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { QuizProvider } from "@/context/QuizContext";
import Navbar from "@/components/Navbar";

// Folosim Outfit ca font principal - un font modern, clar și profesional
const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap" 
});

export const metadata: Metadata = {
  title: "GeoBacAI - Geografia României",
  description: "Aplicație educațională pentru pregătirea BAC la Geografie cu întrebări specifice fiecărui județ din România",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className={`${outfit.variable}`}>
      <body className={`font-sans bg-slate-50 text-slate-900 antialiased`}>
        <QuizProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow">
              {children}
            </div>
          </div>
        </QuizProvider>
      </body>
    </html>
  );
}
