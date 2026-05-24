import PhoneBottomNav from "@/app/layout/PhoneBottomNav";
import PhoneTopBar from "@/app/layout/PhoneTopBar";
import Link from "next/link";

export default function PhoneLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex justify-center flex-col">
            <div className="flex flex-row">
                <Link href='/student' className="font-bold mb-2">←뒤로가기</Link>
                <div className="flex-1"></div>
            </div>
            <div className="h-153 w-272 border-26 border-black rounded-3xl bg-black">
                <div className="w-full h-full bg-white rounded-2xl overflow-hidden flex flex-col">
                    <PhoneTopBar />
                    <div className="flex-1 overflow-hidden">
                        {children}
                    </div>
                    <PhoneBottomNav />
                </div>
            </div>
        </div>
    );
}