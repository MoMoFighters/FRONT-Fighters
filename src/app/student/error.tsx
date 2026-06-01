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

    const [rawStatus, rawMessage] = error.message.split('|');

    const status =
        rawStatus === '500'
            ? 'ERROR!'
            : rawMessage
                ? rawStatus
                : 'ERROR!';

    const message = rawMessage ? rawMessage : error.message || '알 수 없는 오류가 발생했습니다.';

    return (
        <div className='relative'>
            <Image src={errorImg} alt='error' />
            <h3 className='absolute top-30 left-25 text-8xl font-bold text-slate-700'>{status}</h3>
            <div className='absolute w-60 break-all top-75 left-20 text-xl text-slate-500 font-semibold'>{message}</div>
            <Button onClick={() => router.back()}
                className="absolute top-95 left-15 bg-mauve-500 py-2 px-4 hover:-translate-y-0.5 hover:drop-shadow-[0_4px_6px_rgba(0,0,0,0.12)] cursor-pointer transition-all hover:bg-mauve-600">
                <CornerDownLeft /> 모모시티로 돌아가기
            </Button>
            <Button onClick={() => reset()}
                className="absolute top-105 left-15 bg-slate-500 py-2 px-4 hover:-translate-y-0.5 hover:drop-shadow-[0_4px_6px_rgba(0,0,0,0.12)] cursor-pointer transition-all hover:bg-slate-600">
                <RotateCcw /> 다시 시도
            </Button>
        </div>
    );
}