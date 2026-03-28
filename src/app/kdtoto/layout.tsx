import type { Metadata } from "next";
import { Jomhuria, Montserrat } from "next/font/google";
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
  title: "KD TOTO - 8 Angka Hoki",
  description: "Tebak angka hoki dan menangkan hadiah jutaan rupiah!",
};

export default function KdtotoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-theme="kdtoto" className={`${jomhuria.variable} ${montserrat.variable} relative min-h-screen text-white`}>
      <div className="kd-bg-overlay" />
      {children}
    </div>
  );
}
