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
  // template: every page that sets its own title gets " | Tomanni" appended automatically
  title: {
    default:  'Tomanni Official',
    template: '%s | Tomanni',
  },
  description: "Premium streetwear from Lagos, Nigeria. Shop men's and women's clothing, accessories and collections.",
  // metadataBase is the root URL — Next.js prepends it to any relative image paths in OG/twitter
  metadataBase: new URL('https://www.tomanni.com'),
  verification: {
    google: 'GhiTlCXbYT8VnJvxtVsy4Pyyv5LB7dsMX5oK8PXCym4',
  },
  openGraph: {
    type:        'website',
    siteName:    'Tomanni',
    title:       'Tomanni Official',
    description: "Premium streetwear from Lagos, Nigeria.",
    images:      [{ url: '/images/logo-black.png', width: 1500, height: 500, alt: 'Tomanni' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Tomanni Official',
    description: "Premium streetwear from Lagos, Nigeria.",
    images:      ['/images/logo-black.png'],
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
  },
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
