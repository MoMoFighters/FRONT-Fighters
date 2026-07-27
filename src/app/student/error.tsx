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

    const message = isApiError ? parts[1] : "알 수 없는 오류가 발생했습니다.";

    return (
        <div className='relative w-full min-h-[calc(100vh-55px)] overflow-hidden [container-type:inline-size]'>
            <Image src={errorImg} alt='error' priority fill sizes="100vw" className='object-cover' />
            <h1 className='absolute top-[27%] left-[5%] text-[clamp(1.5rem,8cqw,3.75rem)] font-extrabold text-slate-700'>오류!</h1>
            <div className='absolute w-[70%] max-w-80 break-all top-[36%] left-[5%] text-[clamp(0.875rem,3.5cqw,1.125rem)] text-slate-500 font-bold'>{message}</div>
            <Button onClick={() => router.back()}
                className="absolute top-[49%] left-[19%] bg-indigo-500 py-[clamp(0.375rem,1.5cqw,0.5rem)] px-[clamp(0.75rem,3cqw,1rem)] text-[clamp(0.75rem,3cqw,0.875rem)] hover:-translate-y-0.5 hover:drop-shadow-[0_4px_6px_rgba(0,0,0,0.12)] cursor-pointer transition-all hover:bg-indigo-600">
                <CornerDownLeft /> 뒤로 가기
            </Button>
            <Button onClick={() => reset()}
                className="absolute top-[53%] left-[19%] text-slate-700 bg-slate-300 py-[clamp(0.375rem,1.5cqw,0.5rem)] px-[clamp(0.75rem,3cqw,1rem)] text-[clamp(0.75rem,3cqw,0.875rem)] hover:-translate-y-0.5 hover:drop-shadow-[0_4px_6px_rgba(0,0,0,0.12)] cursor-pointer transition-all hover:bg-slate-400">
                <RotateCcw /> 다시 시도
            </Button>
        </div>
    );
}