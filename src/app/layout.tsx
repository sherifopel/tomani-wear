import type { Metadata } from "next";
import { Montserrat, Geist_Mono } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import AuthProvider from "@/components/AuthProvider";
import CurrencyProvider from "@/components/CurrencyProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Montserrat: clean, modern fashion font — free Google Fonts alternative to Gotham.
// We load the weights we actually use; Next.js handles caching + self-hosting.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tomanni Official",
  description: "Premium clothing from Lagos, Nigeria",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Vercel sets x-vercel-ip-country on every request (e.g. "NG", "GB", "US")
  // Falls back to "NG" in local development where the header isn't present
  const headersList = await headers()
  const countryCode = headersList.get('x-vercel-ip-country') ?? 'NG'

  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
          <AuthProvider>
            <CurrencyProvider countryCode={countryCode}>
              <div className="overflow-x-clip flex flex-col flex-1">
                {children}
              </div>
            </CurrencyProvider>
          </AuthProvider>
          <Analytics />
          <SpeedInsights />
        </body>
    </html>
  );
}
