'use client'

import { Button } from '@/components/ui/button';
import pageError from '@/app/assets/img/pageError.png';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ServiceErrorPageProps {
    error: Error & {
        digest?: string;
    };
    reset: () => void;
}

export default function ServiceErrorPage({
    error,
    reset,
}: ServiceErrorPageProps) {
    const router = useRouter();

    const parts = error.message.split('|');

    const isApiError =
        parts.length === 2 &&
        /^\d+$/.test(parts[0]);

    const [status, message] = parts;

    const displayStatus = isApiError ? status : "500";
    const displayMessage = isApiError ? message : "알 수 없는 오류가 발생했습니다.";

    return (
        <main className="flex min-h-[calc(100vh-55px)] w-full items-center justify-center bg-white px-6 pt-6 pb-12">
            <section className="w-full max-w-5xl overflow-hidden bg-white">
                <div className="grid min-h-[520px] grid-cols-1 gap-4 md:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.85fr)]">
                    <div className="flex flex-col justify-center px-10 py-8">
                        <div className="mb-8 inline-flex w-fit items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-500">
                            MoMoCITY
                        </div>

                        <p className="text-8xl font-bold tracking-tight text-slate-950">
                            {displayStatus}
                        </p>

                        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-950">
                            문제가 발생했습니다
                        </h1>

                        <p className="mt-3 max-w-md break-words text-base font-medium leading-7 text-slate-500">
                            {displayMessage}
                        </p>

                        <div className="mt-9 flex flex-wrap items-center gap-3">
                            <Button
                                onClick={() => reset()}
                                className="h-11 cursor-pointer rounded-md bg-indigo-500 px-5 text-sm font-bold text-white transition-colors hover:bg-indigo-600"
                            >
                                <RotateCcw className="h-4 w-4" />
                                다시 시도
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                className="h-11 cursor-pointer rounded-md border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                이전 페이지
                            </Button>
                        </div>
                    </div>

                    <div className="relative hidden p-4 md:block">

                        <div className="flex h-full items-end justify-center">
                            <div className="relative h-80 w-full max-w-80">
                                <Image
                                    src={pageError}
                                    alt="에러 페이지 이미지"
                                    fill
                                    sizes="360px"
                                    preload
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
