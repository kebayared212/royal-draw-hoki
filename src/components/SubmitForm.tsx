"use client";

import dynamic from "next/dynamic";

const SubmitFormBody = dynamic(() => import("./SubmitFormBody"), { ssr: false });

interface SubmitFormProps {
  periodeId: string;
  periodeNumber: number;
  keluaran: string;
  tutup: string;
  periodeEndMs: number;
  isActive: boolean;
  periodeStartDisplay: string;
}

export default function SubmitForm(props: SubmitFormProps) {
  return (
    <div className="mx-4 mb-4 rounded-2xl p-5 submit-form">
      <SubmitFormBody {...props} />
    </div>
  );
}
