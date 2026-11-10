// app/layout.tsx
import type { Metadata } from "next";
import { Providers } from "@/app/providers";
import { cn } from "@/services/graphQl/utils";
import { DM_Sans, Geist_Mono, Playfair_Display } from "next/font/google";
import "@/app/globals.css";

const playfairDisplayHeading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Senzalas Bar Delivery",
  description: "Delivery Senzalas bar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-br"
      suppressHydrationWarning
      className={cn(
        "h-full w-full antialiased",
        dmSans.variable,
        playfairDisplayHeading.variable,
        geistMono.variable,
      )}>
      <body className="min-h-screen font-sans bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
