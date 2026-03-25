import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "Angka Hoki - Royal Draw Hoki",
  description: "Tebak angka hoki dan menangkan hadiah jutaan rupiah!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${urbanist.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col w-full max-w-md mx-auto overflow-x-hidden">{children}</body>
    </html>
  );
}
