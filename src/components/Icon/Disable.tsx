import Image from "next/image";

export default function Disable() {
    return (
        <div className="w-20.5 h-20.5 rounded-full flex items-center justify-center p-5 bg-[#FF262B]" style={{
            boxShadow: "inset 0 4px 4px #FF8A8AD9, 0 0 30px #FF262B7A"
        }}>
            <Image src="/images/icon/x.png" alt="disable" width={82} height={82} className="w-full"/>
        </div>
    )
}