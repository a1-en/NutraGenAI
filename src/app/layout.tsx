import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

// Optimize font loading to prevent unused preload warnings
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"], // Specify exact weights needed
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  title: "NutraGenAI - Your Healthy Eating Companion",
  description: "AI-powered nutrition and healthy lifestyle assistant with personalized meal planning, recipe generation, and health insights.",
  keywords: "nutrition, healthy eating, meal planning, AI, health, fitness, diet",
  authors: [{ name: "NutraGenAI Team" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "NutraGenAI - Your Healthy Eating Companion",
    description: "AI-powered nutrition and healthy lifestyle assistant with personalized meal planning, recipe generation, and health insights.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "NutraGenAI - Your Healthy Eating Companion",
    description: "AI-powered nutrition and healthy lifestyle assistant with personalized meal planning, recipe generation, and health insights.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#22c55e" },
    { media: "(prefers-color-scheme: dark)", color: "#16a34a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col bg-background text-foreground">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
