import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
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
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} h-full`}>
      <body className="min-h-full">
        <SearchProvider>
          <Sidebar />
          <div className="flex min-h-screen flex-col lg:pl-[280px]">
            <MobileNav />
            <main className="page-in flex-1">{children}</main>
          </div>
        </SearchProvider>
      </body>
    </html>
  );
}
