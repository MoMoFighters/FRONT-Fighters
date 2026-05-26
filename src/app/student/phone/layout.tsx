import PhoneBottomNav from "@/app/layout/PhoneBottomNav";
import PhoneTopBar from "@/app/layout/PhoneTopBar";
import Link from "next/link";

export default function PhoneLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex justify-center flex-col p-3">
            {/* <div className="flex flex-row">
                <Link href='/student' className="font-bold mb-2">←</Link>
                <div className="flex-1"></div>
            </div> */}
            <div className="min-h-full min-w-full h-160 border-26 border-black rounded-3xl bg-black">
                <div className="w-full h-full bg-white rounded-2xl overflow-hidden flex flex-col">
                    <PhoneTopBar />
                    <div className="flex-1 overflow-hidden">
                        {children}
                    </div>
                    {/* <PhoneBottomNav /> */}
                </div>
            </div>
        </div>
    );
}