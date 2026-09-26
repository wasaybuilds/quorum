import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AppFrame } from "@/components/layout/AppFrame";
import { SearchProvider } from "@/components/search/SearchProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Quorum — Meeting intelligence",
    template: "%s · Quorum",
  },
  description:
    "Quorum turns meetings into searchable, actionable intelligence: summaries, decisions, action items and answers with sources.",
};

export const viewport: Viewport = {
  themeColor: "#111827",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} h-full`}>
      <body className="min-h-full">
        <SearchProvider>
          <AppFrame>{children}</AppFrame>
        </SearchProvider>
      </body>
    </html>
  );
}
