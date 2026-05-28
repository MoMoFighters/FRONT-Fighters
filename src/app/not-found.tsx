'use client'

import Image from "next/image";
import logo from '@/app/assets/img/header_logo.png'
import notFound from '@/app/assets/img/404.png'
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {

    const router = useRouter();

    return (
        <>
            <div className="flex flex-col w-full h-full relative">
                <header className="h-16 border-b border-slate-200 bg-slate-50">
                    <div className="flex h-full w-full justify-between items-center px-2">
                        <Image
                            src={logo}
                            alt="MOMOCITY 로고"
                            className="mt-3"
                            width={150}
                            height={20}
                            priority
                        />
                    </div>
                </header>
                <main className="flex-1 w-full">
                    <Image
                        src={notFound}
                        alt="MOMOCITY 로고"
                        priority
                    />
                </main>
                <div onClick={() => router.back()}
                    className="flex gap-4 items-center rotate-[-8deg] absolute top-115 left-60 skew-x-[-8deg] text-2xl font-bold text-[#c8a896] hover:text-[#b09584]
                                hover:-translate-y-0.5 hover:drop-shadow-[0_4px_6px_rgba(0,0,0,0.12)] cursor-pointer transition-all">
                    <RotateCcw /> 모모시티로 돌아가기
                </div>
                <footer className="h-20 bg-slate-100 border-t border-slate-200 flex justify-center items-center">
                    <div className="flex-col items-center gap-0.5">
                        <p className="text-sm text-slate-400">이용약관 | 개인정보처리방침 | 고객지원</p>
                        <p className="text-sm text-slate-400 text-center">yourmomocity@gmail.com</p>
                    </div>
                </footer>
            </div >
        </>
    );
}