import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Sudin Pendidikan Wilayah II Jakarta Utara",
  description: "Portal Suku Dinas Pendidikan Wilayah II Jakarta Utara",
  icons: {
    icon: [
      {
        url: "/images/logo_sudindikju2-removebg.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: {
      url: "/images/logo_sudindikju2-removebg.png",
      sizes: "180x180",
      type: "image/png",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo_sudindikju2-removebg.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/images/logo_sudindikju2-removebg.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
