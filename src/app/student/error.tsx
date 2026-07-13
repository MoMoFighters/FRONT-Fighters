'use client'

import errorImg from '@/app/assets/img/error.png'
import { Button } from '@/components/ui/button';
import { CornerDownLeft, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Error({
    error,
    reset
}: {
    error: Error & {
        digest?: string
    };
    reset: () => void;
}) {

    const router = useRouter();

    const parts = error.message.split('|');

    const isApiError =
        parts.length === 2 &&
        /^\d+$/.test(parts[0]);

    const [status, message] = parts;

    return (
        <div className='relative w-screen min-h-[calc(100vh-140px)] overflow-hidden'>
            <Image src={errorImg} alt='error' priority fill sizes="100vw" className='object-cover' />
            <h1 className='absolute top-60 left-20 text-6xl font-extrabold text-slate-700'>{isApiError ? status : "에러 발생!"}</h1>
            <div className='absolute w-80 max-w-80 break-all top-80 left-20 text-lg text-slate-500 font-semibold'>{isApiError ? message : "알 수 없는 오류가 발생했습니다."}</div>
            <Button onClick={() => router.back()}
                className="absolute top-110 left-70 bg-indigo-500 py-2 px-4 hover:-translate-y-0.5 hover:drop-shadow-[0_4px_6px_rgba(0,0,0,0.12)] cursor-pointer transition-all hover:bg-indigo-600">
                <CornerDownLeft /> 뒤로 가기
            </Button>
            <Button onClick={() => reset()}
                className="absolute top-120 left-70 text-slate-700 bg-slate-300 py-2 px-4 hover:-translate-y-0.5 hover:drop-shadow-[0_4px_6px_rgba(0,0,0,0.12)] cursor-pointer transition-all hover:bg-slate-400">
                <RotateCcw /> 다시 시도
            </Button>
            <div className='absolute top-62 left-147 w-14 h-8 bg-[#3F4550] flex justify-center items-center text-white blur-[1px]'>{isApiError ? status : "error!"}</div>
        </div>
    );
}