'use client'

import Image from "next/image";
import notFound from '@/app/assets/img/404.png'
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {

    const router = useRouter();

    return (
        <>
            <main className="w-screen h-screen">
                <div className="w-full h-full overflow-hidden relative">
                    <Image
                        src={notFound}
                        alt="404 페이지"
                        fill
                        priority
                    />
                </div>
                <div onClick={() => router.back()}
                    className="flex gap-4 items-center rotate-[-8deg] absolute top-90 left-60 skew-x-[-8deg] text-2xl font-extrabold text-[#c8a896] hover:text-[#b09584]
                                hover:-translate-y-0.5 hover:drop-shadow-[0_4px_6px_rgba(0,0,0,0.12)] cursor-pointer transition-all">
                    <RotateCcw /> 모모시티로 돌아가기
                </div>
            </main >
        </>
    );
}