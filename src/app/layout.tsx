import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { GoogleAnalytics } from '@next/third-parties/google'

const satoshi = localFont({
  src: [
    {
      path: "../pages/fonts/satoshi/Satoshi-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../pages/fonts/satoshi/Satoshi-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../pages/fonts/satoshi/Satoshi-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../pages/fonts/satoshi/Satoshi-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../pages/fonts/satoshi/Satoshi-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "Ray's Bookshelf",
  description: "Read books online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${satoshi.className} h-screen`}>
      
        <div className="bg-[#FFFBEF] text-[#39210C] h-full">
          {children}
          </div>
      </body>
      <GoogleAnalytics gaId="G-91Z3E15N29" />
    </html>
  );
}
