import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Montserrat: clean, modern fashion font — free Google Fonts alternative to Gotham.
// We load only the weights we actually use; Next.js self-hosts and caches them.
// 900 removed — nothing in the codebase uses font-black/font-extrabold.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tomanni Official",
  description: "Premium clothing from Lagos, Nigeria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
          <AuthProvider>
            <div className="overflow-x-clip flex flex-col flex-1">
              {children}
            </div>
          </AuthProvider>
          <Analytics />
          <SpeedInsights />
        </body>
    </html>
  );
}
