'use client'

import Image from "next/image";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { useState } from "react";
import postBoard from "@/app/assets/img/guestBook.png"
import { Button } from "../ui/button";
import { Plus, Search, X } from "lucide-react";

interface PostBoardProps {
    mode: "MY" | "FRIEND";
}

type PostBoardMode = "guestbook" | "notice";

export default function PostBoard({ mode }: PostBoardProps) {

    const [isModal, setIsModal] = useState(false);
    const [detail, setDetail] = useState(false);
    const [nav, setNav] = useState<PostBoardMode>('guestbook');

    return (
        <>
            <HoverCard
                openDelay={50}
                closeDelay={50}
            >
                <HoverCardTrigger asChild>
                    <div
                        className="absolute bottom-[11%] left-[44%] z-10 aspect-square w-[7%] cursor-pointer"
                        style={{
                            transform: "rotate(-17deg) skewX(-15deg) scaleY(0.92)",
                            transformOrigin: "center",
                        }}
                        onClick={() => setIsModal(true)}
                    >
                        <div className="relative h-full w-full transition-transform duration-200 hover:scale-110">
                            <Image
                                src={postBoard}
                                alt="방명록"
                                fill
                                quality={80}
                                sizes="7vw"
                            />
                        </div>
                    </div>
                </HoverCardTrigger>
                <HoverCardContent
                    side="top"
                    align="center"
                    sideOffset={8}
                >
                    <div className="space-y-1 -top-20">
                        <p className="text-sm font-bold text-slate-900">
                            방명록
                        </p>
                        <p className="text-xs font-medium text-slate-500">
                            {mode === "MY" ? "친구가 작성한 방명록을 확인해보세요." : "방명록을 작성해보세요."}
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

                        <div className="mb-1 pr-10">

                            <h2 className="text-2xl font-black text-slate-900">
                                게시판
                            </h2>

                            <p className="mt-1 text-sm font-medium text-slate-400">
                                친구가 남긴 방명록과 시스템 공지사항을 확인해보세요.
                            </p>
                        </div>
                        <div className="mt-2 mb-3 mr-2 flex flex-row gap-2">
                            {mode === "MY" ? (
                                <div className="mb-1 ml-2 flex flex-1 gap-8 border-b border-slate-200">
                                    <div
                                        className={`border-b-2 px-1 pb-3 text-sm font-bold transition ${nav === 'guestbook'
                                            ? "border-indigo-400 text-indigo-500"
                                            : "border-transparent text-slate-500 hover:text-slate-900"
                                            } cursor-pointer`}
                                        onClick={() => setNav('guestbook')}
                                    >
                                        방명록
                                    </div>
                                    <div
                                        className={`border-b-2 px-1 pb-3 text-sm font-bold transition ${nav === 'notice'
                                            ? "border-indigo-400 text-indigo-500"
                                            : "border-transparent text-slate-500 hover:text-slate-900"
                                            } cursor-pointer`}
                                        onClick={() => setNav('notice')}
                                    >
                                        공지사항
                                    </div>
                                </div>
                            ) : <div className="flex-1"></div>}
                            {mode === 'FRIEND' ? (
                                <Button className="cursor-pointer py-4 bg-indigo-500">
                                    <Plus />
                                    방명록 작성
                                </Button>
                            ) : ""}
                        </div>

                        <div className="h-101 flex-1 overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50/80 p-3 scrollbar-none">
                            <div className="grid grid-cols-3 gap-2 min-h-94.5">
                                {Array.from({ length: 21 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="h-22 cursor-pointer flex w-full items-center justify-between rounded-2xl border border-indigo-100 bg-white p-3 text-left shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/60"
                                    >
                                        <div className="w-full flex flex-col gap-0">
                                            <p className="select-none text-sm font-black text-slate-800">
                                                게시글 제목
                                            </p>
                                            <p className="text-right select-none mt-0.5 text-xs font-semibold text-slate-400">
                                                친구의 이름
                                            </p>
                                            <p className="select-none mt-0.5 text-xs font-semibold text-slate-400">
                                                게시글 내용....
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
