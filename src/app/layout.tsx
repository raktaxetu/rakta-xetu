import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import { QueryProvider } from "@/components/query-provider";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RaktaXetu - Connect Blood Donors & Recipients Across Assam",
  description:
    "RaktaXetu is Assam's trusted blood donation platform, bridging the gap between donors and recipients. Join our life-saving network and help save lives across the state.",
};

export default function RootLayout({ children }: Children) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/logo.jpg" />
      </head>
      <body className={inter.className}>
        <QueryProvider>
          <main>
            {children}
            <Toaster />
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
