import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { AppFrame } from "@/components/layout/AppFrame";
import { SearchProvider } from "@/components/search/SearchProvider";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
  themeColor: "#1c1c1c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrains.variable} h-full`}>
      <body className="min-h-full">
        <SearchProvider>
          <AppFrame>{children}</AppFrame>
        </SearchProvider>
      </body>
    </html>
  );
}
