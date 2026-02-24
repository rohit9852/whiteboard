import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Whiteboard — Infinite Canvas",
  description: "A beautiful, feature-rich infinite whiteboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ height: '100%', overflow: 'hidden' }}>
      <body
        className={`${geistSans.variable} ${inter.variable} antialiased`}
        style={{ height: '100%', overflow: 'hidden', margin: 0 }}
      >
        {children}
      </body>
    </html>
  );
}
