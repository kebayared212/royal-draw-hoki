import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Angka Hoki",
  description: "Tebak angka hoki dan menangkan hadiah jutaan rupiah!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full w-full overflow-x-hidden bg-black text-white">
        {children}
      </body>
    </html>
  );
}
