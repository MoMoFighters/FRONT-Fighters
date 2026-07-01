'use client'

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ImageIcon, LockKeyholeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { getProfileOrderListAction } from "@/features/point/action";
import { ProfileOrderItem } from "@/features/point/type";

export default function UserProfileChoice({ profileChangeOpen, setProfileChangeOpen, onSelectProfileImage }: {
    profileChangeOpen: boolean;
    setProfileChangeOpen: (a: boolean) => void;
    onSelectProfileImage: (imageUrl: string, itemName: string) => void;
}) {
    const containerRef =
        useRef<HTMLDivElement>(null);
    const [ownedItems, setOwnedItems] =
        useState<ProfileOrderItem[]>([]);
    const [notOwnedItems, setNotOwnedItems] =
        useState<ProfileOrderItem[]>([]);
    const [isLoading, setIsLoading] =
        useState(false);

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

    useEffect(() => {
        if (!profileChangeOpen) {
            return;
        }

        let ignore = false;

        const loadProfileItems = async () => {
            setIsLoading(true);

            try {
                const response =
                    await getProfileOrderListAction();

                if (ignore) {
                    return;
                }

                setOwnedItems(response.data?.owned ?? []);
                setNotOwnedItems(response.data?.notOwned ?? []);
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        };

        void loadProfileItems();

        return () => {
            ignore = true;
        };
    }, [profileChangeOpen]);

    if (!profileChangeOpen) {
        return ""
    }

    return (
        <div
            ref={containerRef}
            className="absolute left-28 top-0 z-50 flex flex-row"
        >
            <div className="h-full">
                <div className="mt-13 h-0 w-0 border-y-[8px] border-r-[12px] border-y-transparent border-r-white drop-shadow-sm" />
            </div>

            <div className="flex w-90 flex-col gap-2 rounded-2xl border border-indigo-100 bg-white/95 p-3 shadow-xl shadow-indigo-100/60 backdrop-blur">
                <div className="flex flex-row justify-between py-1">
                    <h3 className="text-md font-black text-slate-800">
                        프로필 변경
                    </h3>
                    <Link href='/student/point-store' className="flex items-center">
                        <p className="text-[13px] font-bold text-indigo-400">
                            상점으로 이동
                        </p>
                    </Link>
                </div>

                <div className="scrollbar-none grid max-h-60 w-full grid-cols-4 gap-2 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50/80 p-1">
                    {isLoading ? (
                        <div className="col-span-4 flex h-24 items-center justify-center text-xs font-bold text-slate-400">
                            불러오는 중...
                        </div>
                    ) : (
                        <>
                            {ownedItems.map((item) => (
                                <button
                                    key={`owned-${item.itemName}`}
                                    type="button"
                                    onClick={() => {
                                        if (item.imageUrl && item.itemName) {
                                            onSelectProfileImage(
                                                item.imageUrl,
                                                item.itemName
                                            );
                                        }
                                    }}
                                    disabled={!item.imageUrl}
                                    className="relative flex h-[75px] w-[75px] cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-indigo-100 bg-white text-sm font-bold text-slate-600 transition-colors hover:bg-indigo-50"
                                >
                                    {item.imageUrl ? (
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.itemName}
                                            fill
                                            sizes="75px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <ImageIcon className="h-7 w-7 text-slate-300" />
                                    )}
                                </button>
                            ))}

                            {notOwnedItems.map((item) => (
                                <HoverCard
                                    key={`not-owned-${item.itemName}`}
                                    openDelay={50}
                                    closeDelay={50}
                                >
                                    <HoverCardTrigger asChild>
                                        <div className="relative flex h-[75px] w-[75px] cursor-not-allowed items-center justify-center overflow-hidden rounded-xl border border-indigo-100 bg-white text-sm font-bold text-slate-600 transition-colors">
                                            {item.imageUrl ? (
                                                <Image
                                                    src={item.imageUrl}
                                                    alt={item.itemName}
                                                    fill
                                                    sizes="75px"
                                                    className="object-cover opacity-35 grayscale"
                                                />
                                            ) : (
                                                <ImageIcon className="h-7 w-7 text-slate-300" />
                                            )}
                                            <div className="absolute inset-0 flex items-center justify-center bg-white/25">
                                                <LockKeyholeIcon className="h-7 w-7 text-slate-700/70" />
                                            </div>
                                        </div>
                                    </HoverCardTrigger>
                                    <HoverCardContent
                                        side="left"
                                        align="center"
                                        sideOffset={8}
                                    >
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-slate-900">
                                                보유 중이지 않은 아이템
                                            </p>
                                            <p className="text-xs font-medium text-slate-500">
                                                상점에서 포인트로 구매할 수 있습니다.
                                            </p>
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
