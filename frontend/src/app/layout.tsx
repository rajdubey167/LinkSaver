// Root layout for the app
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LinkSaver",
  description: "Save and organize your links",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.variable}>
      <body className={geist.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
