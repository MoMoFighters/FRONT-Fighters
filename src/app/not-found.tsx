'use client'

import Image from "next/image";
import logo from '@/app/assets/img/logo.png'
import notFound from '@/app/assets/img/404.png'
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {

    const router = useRouter();

    return (
        <>
            <div className="flex flex-col w-full h-full relative overflow-hidden">
                <main className="flex-1 w-full overflow-hidden">
                    <Image
                        src={notFound}
                        alt="MOMOCITY 로고"
                        priority
                    />
                </main>
                <div onClick={() => router.back()}
                    className="flex gap-4 items-center rotate-[-8deg] absolute top-100 left-60 skew-x-[-8deg] text-2xl font-bold text-[#c8a896] hover:text-[#b09584]
                                hover:-translate-y-0.5 hover:drop-shadow-[0_4px_6px_rgba(0,0,0,0.12)] cursor-pointer transition-all">
                    <RotateCcw /> 모모시티로 돌아가기
                </div>
            </div >
        </>
    );
}