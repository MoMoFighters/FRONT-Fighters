'use client'

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Ban, LockKeyholeIcon, Paintbrush2, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import tempImage from "@/app/assets/img/cityImg.png"

export default function UserProfileChoice({ profileChangeOpen, setProfileChangeOpen }: {
    profileChangeOpen: boolean;
    setProfileChangeOpen: (a: boolean) => void;
}) {

    const containerRef =
        useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!profileChangeOpen) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target as Node;

            if (containerRef.current?.contains(target)) {
                return;
            }

            setProfileChangeOpen(false);
        };

        document.addEventListener(
            "pointerdown",
            handlePointerDown
        );

        return () => {
            document.removeEventListener(
                "pointerdown",
                handlePointerDown
            );
        };
    }, [profileChangeOpen, setProfileChangeOpen]);

    if (!profileChangeOpen) {
        return ""
    }

    const profileChoices =
        Array.from({ length: 6 });

    return (
        <div
            ref={containerRef}
            className="absolute left-28 top-0 z-50 flex flex-row"
        >
            <div className="h-full">
                <div className="mt-13 w-0 h-0 border-t-[8px] border-t-transparent border-r-[12px] border-r-white border-b-[8px] border-b-transparent drop-shadow-sm" />
            </div>

            <div className="bg-white/95 w-90 rounded-2xl border border-indigo-100 p-3 flex flex-col gap-2 shadow-xl shadow-indigo-100/60 backdrop-blur">
                <div className="flex flex-row justify-between py-1">
                    <h3 className="font-black text-md text-slate-800">
                        프로필 변경
                    </h3>
                    <Link href='/student/point-store' className="flex items-center">
                        <p className="text-[13px] font-bold text-indigo-400">
                            상점으로 이동
                        </p>
                    </Link>
                </div>

                <div className="w-full max-h-60 grid grid-cols-4 p-1 rounded-xl gap-2 overflow-y-auto scrollbar-none bg-slate-50/80 border border-slate-100">
                    {profileChoices.map((_, index) => (
                        <div
                            key={index}
                            className="border border-indigo-100 bg-white w-[75px] h-[75px] hover:bg-indigo-50 rounded-xl text-sm font-bold text-slate-600 transition-colors cursor-pointer flex items-center justify-center text-center"
                        >
                            <Paintbrush2 className="w-full h-full" />
                        </div>
                    ))}
                    <HoverCard
                        openDelay={50}
                        closeDelay={50}
                    >
                        <HoverCardTrigger asChild>
                            <div
                                className="cursor-not-allowed border border-indigo-100 bg-white w-[75px] h-[75px] rounded-xl text-sm font-bold text-slate-600 transition-colors flex items-center justify-center text-center"
                            >
                                <LockKeyholeIcon className="h-full w-full text-slate-700/50 relative">
                                    {/* <Image fill src={tempImage} alt="프로필" /> */}
                                    <User className="h-full w-full text-green-700" />
                                </LockKeyholeIcon>
                            </div>
                        </HoverCardTrigger>
                        <HoverCardContent
                            side="left"
                            align="center"
                            sideOffset={8}
                        >
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-slate-900">
                                    보유중이지 않은 아이템
                                </p>
                                <p className="text-xs font-medium text-slate-500">
                                    상점에서 포인트로 구매할 수 있습니다.
                                </p>
                            </div>
                        </HoverCardContent>
                    </HoverCard>

                </div>
            </div>
        </div>
    );
}
