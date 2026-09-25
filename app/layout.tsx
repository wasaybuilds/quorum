import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { SearchProvider } from "@/components/search/SearchProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <SearchProvider>
          <Sidebar />
          <div className="flex min-h-screen flex-col lg:pl-60">
            <MobileNav />
            <main className="flex-1">{children}</main>
          </div>
        </SearchProvider>
      </body>
    </html>
  );
}
