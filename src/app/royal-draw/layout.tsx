import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { AudioManager } from "@/components/AudioManager";
import WelcomeDialog from "@/components/WelcomeDialog";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Angka Hoki - Royal Draw Hoki",
  description: "Tebak angka hoki dan menangkan hadiah jutaan rupiah!",
};

export default function RoyalDrawLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${urbanist.className} flex flex-col w-full max-w-md mx-auto`}>
      <AudioManager>
        <WelcomeDialog />
        {children}
      </AudioManager>
    </div>
  );
}
