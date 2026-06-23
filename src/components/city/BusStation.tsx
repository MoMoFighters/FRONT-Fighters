'use client'

import busStaion from '@/app/assets/img/busStation.png'
import { Search, X } from 'lucide-react'
import Image from "next/image";
import { useState } from 'react';

import { Button } from '../ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import Link from 'next/link';

interface BusStationProps {
    mode: 'MY' | "FRIEND";
}

export default function BusStation({ mode }: BusStationProps) {

    const [isModal, setIsModal] = useState(false);

    return (
        <>
            <HoverCard
                openDelay={50}
                closeDelay={50}
            >
                <HoverCardTrigger asChild>
                    {mode === 'FRIEND' ? (
                        <Link
                            href='/student'
                            className="absolute left-[22.5%] top-[18.5%] z-10 aspect-square w-[9.375%] cursor-pointer"
                            style={{
                                transform: "rotate(-8deg) skewX(-5deg) scaleY(0.92)",
                                transformOrigin: "center",
                            }}
                        >
                            <BusStationVisual />
                        </Link>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsModal(true)}
                            className="absolute left-[22.5%] top-[18.5%] z-10 aspect-square w-[9.375%] cursor-pointer border-0 bg-transparent p-0"
                            style={{
                                transform: "rotate(-8deg) skewX(-5deg) scaleY(0.92)",
                                transformOrigin: "center",
                            }}
                        >
                            <BusStationVisual />
                        </button>
                    )}
                </HoverCardTrigger>
                <HoverCardContent
                    side="bottom"
                    align="center"
                    sideOffset={8}
                >
                    <div className="space-y-1 -top-20 z-40">
                        <p className="text-sm font-bold text-slate-900">
                            버스정류장
                        </p>
                        <p className="text-xs font-medium text-slate-500">
                            {mode === 'MY' ? "친구의 도시로 이동해보세요" : "내 도시로 이동합니다."}
                        </p>
                    </div>
                </HoverCardContent>
            </HoverCard>


            {isModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm"
                    onClick={() => setIsModal(false)}
                >
                    <div
                        className="relative flex max-h-[78vh] w-[60vw] flex-col overflow-hidden rounded-3xl border border-white/80 bg-white/95 p-6 shadow-2xl shadow-slate-950/25"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setIsModal(false)}
                            className="absolute right-5 top-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            aria-label="닫기"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="mb-5 pr-10">

                            <h2 className="text-2xl font-black text-slate-900">
                                친구 도시로 이동하기
                            </h2>

                            <p className="mt-1 text-sm font-medium text-slate-400">
                                방문할 친구를 검색하고 도시로 이동해보세요.
                            </p>
                        </div>

                        <div className="mb-4 flex flex-row gap-2">
                            <input
                                type="text"
                                placeholder="친구 닉네임으로 검색해보세요"
                                className="h-11 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                            />

                            <Button
                                type="button"
                                className="h-11 rounded-2xl bg-indigo-500 px-4 font-black text-white hover:bg-indigo-600"
                            >
                                <Search className="h-4 w-4" />
                                검색
                            </Button>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50/80 p-3 scrollbar-none">
                            <div className="grid grid-cols-3 gap-2">
                                {Array.from({ length: 11 }).map((_, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className="cursor-pointer flex h-18 w-full items-center justify-between rounded-2xl border border-indigo-100 bg-white p-3 text-left shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/60"
                                    >
                                        <div>
                                            <p className="text-sm font-black text-slate-800">
                                                친구 닉네임
                                            </p>
                                            <p className="mt-0.5 text-xs font-semibold text-slate-400">
                                                친구 도시로 이동하기
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function BusStationVisual() {
    return (
        <div
            className="relative h-full w-full transition-transform duration-200 hover:scale-110"
        >
            <Image
                src={busStaion}
                alt="버스정류장"
                fill
                quality={80}
                sizes="10vw"
            />
        </div>
    );
}
