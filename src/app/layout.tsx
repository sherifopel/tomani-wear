import type { Metadata } from "next";
import { Montserrat, Geist_Mono } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
          <div className="overflow-x-clip flex flex-col flex-1">
            {children}
          </div>
        </body>
    </html>
  );
}
