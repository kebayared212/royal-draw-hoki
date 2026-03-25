import Image from "next/image";

export default function Success() {
    return (
        <div className="w-20.5 h-20.5 rounded-full flex items-center justify-center p-5 bg-[#00CD33]" style={{
            boxShadow: "inset 0 4px 4px #26FF3C7A, 0 0 30px #8AFF9FD9"
        }}>
            <Image src="/images/icon/success.png" alt="disable" width={82} height={82} className="w-full"/>
        </div>
    )
}