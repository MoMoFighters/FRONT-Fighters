"use client";

import { useState } from "react";

import FortuneModal from "@/components/city/FortuneModal";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

interface FortuneSpotProps {
    variant?: "desktop" | "mobile";
}

export default function FortuneSpot({ variant = "desktop" }: FortuneSpotProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {variant === "mobile" ? (
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="block w-full cursor-pointer border-0 bg-transparent p-0 text-left"
                >
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="font-black text-slate-900">
                            오늘의 운세
                        </p>
                        <p className="mt-1 text-xs font-medium text-slate-500">
                            5포인트를 사용하여 운세를 봅니다.
                        </p>
                    </div>
                </button>
            ) : (
                <div className="absolute top-[41%] right-[9.5%] z-10 aspect-square w-[12%]">
                    <HoverCard openDelay={50} closeDelay={50}>
                        <HoverCardTrigger asChild>
                            <button
                                type="button"
                                onClick={() => setIsOpen(true)}
                                className="block h-full w-full cursor-pointer border-0 p-0 bg-transparent"
                                aria-label="운세 보기"
                            />
                        </HoverCardTrigger>
                        <HoverCardContent side="top" align="center" sideOffset={8}>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-slate-900">
                                    운세
                                </p>
                                <p className="text-xs font-medium text-slate-500">
                                    5포인트를 사용하여 운세를 봅니다.
                                </p>
                            </div>
                        </HoverCardContent>
                    </HoverCard>

                    <span className="pointer-events-none absolute bottom-0 left-1/2 z-10 -translate-x-1/2 translate-y-1/2 whitespace-nowrap rounded-[0.3cqw] bg-white px-[0.4cqw] py-[0.08cqw] text-[0.75cqw] font-bold text-slate-700 shadow-sm">
                        운세
                    </span>
                </div>
            )}

            <FortuneModal open={isOpen} onOpenChange={setIsOpen} />
        </>
    );
}
