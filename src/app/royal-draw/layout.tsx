import type { Metadata } from "next";
import localFont from "next/font/local";
import { AudioManager } from "@/components/AudioManager";
import WelcomeDialog from "@/components/WelcomeDialog";

const gilroy = localFont({
  src: [
    { path: "../../../public/font/Gilroy-Family/Gilroy-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../../public/font/Gilroy-Family/Gilroy-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../../public/font/Gilroy-Family/Gilroy-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../../public/font/Gilroy-Family/Gilroy-Bold.ttf", weight: "700", style: "normal" },
    { path: "../../../public/font/Gilroy-Family/Gilroy-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "../../../public/font/Gilroy-Family/Gilroy-Heavy.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-gilroy",
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
    <div className={`${gilroy.className} flex flex-col w-full max-w-md mx-auto`}>
      <AudioManager>
        <WelcomeDialog />
        {children}
      </AudioManager>
    </div>
  );
}
