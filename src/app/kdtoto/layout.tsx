import type { Metadata } from "next";
import { Jomhuria, Montserrat } from "next/font/google";
import { KdReadyProvider } from "@/components/kdtoto/KdReadyContext";
import KdWelcomeDialog from "@/components/kdtoto/WelcomeDialog";
import "./kdtoto.css";

const jomhuria = Jomhuria({
  variable: "--kd-jomhuria",
  subsets: ["latin"],
  weight: "400",
});

const montserrat = Montserrat({
  variable: "--kd-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "KDTOTO - 8 Angka Hoki",
  description: "Tebak angka hoki dan menangkan hadiah jutaan rupiah!",
};

export default function KdtotoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <KdReadyProvider>
      <div data-theme="kdtoto" className={`${jomhuria.variable} ${montserrat.variable} relative min-h-screen text-white`}>
        <div className="kd-bg-overlay" />
        <KdWelcomeDialog />
        {children}
      </div>
    </KdReadyProvider>
  );
}
