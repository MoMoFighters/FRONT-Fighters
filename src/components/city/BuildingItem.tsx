"use client";

import Image, { StaticImageData } from "next/image";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Home, Users, X } from "lucide-react";
import getCategoryMeta from "@/features/lecture/components/student/shared/category";
import { Category } from "@/features/lecture/type";

import mypage from "@/app/assets/img/mypage.png";
import point from "@/app/assets/img/point.png";
import createBuilding from "@/app/assets/img/createBuilding.png"

type CommonBuilding = "mypage" | "point";
type CityMode = "MY" | "FRIEND";

interface BuildingItemProps {
    common?: CommonBuilding,
    category?: Category,
    level?: number,
    buildingUrl?: string | StaticImageData
    position?: number
    priority?: boolean
    imageSizes?: string
    interactive?: boolean
    mode?: CityMode
    friendNickname?: string
}

export default function BuildingItem({
    common,
    category,
    level,
    buildingUrl,
    position,
    priority = false,
    imageSizes = "(max-width: 768px) 18vw, 13vw",
    interactive = true,
    mode = "MY",
    friendNickname,
}: BuildingItemProps) {
    const [isMypageChoiceOpen, setIsMypageChoiceOpen] = useState(false);

    const getBuildingInfo = () => {
        if (common && common === "mypage") {
            return mode === "FRIEND"
                ? {
                    label: "그룹 스터디",
                    buildingName: friendNickname ? `${friendNickname}의 집` : "집",
                    description: "그룹 스터디로 이동합니다.",
                    buildingImage: mypage,
                    href: "/student/group-study"
                }
                : {
                    label: "마이페이지",
                    buildingName: "집",
                    description: "마이페이지 또는 그룹 스터디로 이동합니다.",
                    buildingImage: mypage,
                    href: "/student/mypage"
                }
        }

        if (common && common === "point") {
            return {
                label: "포인트상점",
                buildingName: "포인트상점",
                description: "포인트 상점으로 이동합니다.",
                buildingImage: point,
                href: "/student/point-store"
            }
        }

        if (category && buildingUrl) {
            return {
                ...getCategoryMeta(category),
                buildingImage: buildingUrl,
                href: `/student/${category.toLowerCase()}/lectures`
            }
        }

        return {
            label: "수강신청하기",
            buildingName: "건물 생성",
            description: "강의를 수강하고 건물을 성장시켜보세요.",
            buildingImage: createBuilding,
            href: `/student/lectures${position ? `?position=${position}` : ""}`
        }
    }

    const buildingInfo = getBuildingInfo();
    const isPlaceholder = !common && !(category && buildingUrl);

    const visual = (
        <>
            <Image
                src={buildingInfo.buildingImage}
                alt={buildingInfo.label}
                fill
                sizes={imageSizes}
                priority={priority}
                className="object-contain"
            />

            {!isPlaceholder && (
                <span className="pointer-events-none absolute bottom-0 left-1/2 z-10 -translate-x-1/2 translate-y-1/2 whitespace-nowrap rounded-[0.3cqw] bg-white px-[0.4cqw] py-[0.08cqw] text-[0.75cqw] font-bold text-slate-700 shadow-sm">
                    {buildingInfo.buildingName}
                </span>
            )}
        </>
    );

    if (!interactive) {
        return (
            <div className="relative block w-full h-full">
                {visual}
            </div>
        );
    }

    const isMypageChoiceBuilding = common === "mypage" && mode === "MY";

    return (
        <>
            <HoverCard openDelay={50} closeDelay={50}>
                <HoverCardTrigger asChild>
                    {isMypageChoiceBuilding ? (
                        <button
                            type="button"
                            onClick={() => setIsMypageChoiceOpen(true)}
                            className="relative block h-full w-full cursor-pointer border-0 bg-transparent p-0 transition-all hover:scale-110"
                        >
                            {visual}
                        </button>
                    ) : (
                        <Link href={buildingInfo.href} className="relative block w-full h-full hover:scale-110 transition-all">
                            {visual}
                        </Link>
                    )}
                </HoverCardTrigger>
                <HoverCardContent className="flex w-64 flex-col gap-0.5" side="bottom">
                    <div className="font-bold text-slate-700 text-[14px]">{buildingInfo.buildingName} {level ? `Lv.${level}` : ""}</div>
                    <div className="text-slate-500 text-[12px]">{buildingInfo.description}</div>
                </HoverCardContent>
            </HoverCard>

            {isMypageChoiceBuilding && isMypageChoiceOpen && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm"
                    onClick={() => setIsMypageChoiceOpen(false)}
                >
                    <div
                        className="relative w-full max-w-md rounded-3xl border border-white/80 bg-white/95 p-6 shadow-2xl shadow-slate-950/25"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setIsMypageChoiceOpen(false)}
                            className="absolute right-5 top-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            aria-label="닫기"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <h2 className="mb-5 text-xl font-black text-slate-900">
                            어디로 이동할까요?
                        </h2>

                        <div className="grid grid-cols-2 gap-3">
                            <Link
                                href="/student/mypage"
                                onClick={() => setIsMypageChoiceOpen(false)}
                                className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-5 text-center transition hover:border-indigo-200 hover:bg-indigo-50/60"
                            >
                                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-500">
                                    <Home className="h-5 w-5" />
                                </span>
                                <span className="text-sm font-black text-slate-800">
                                    마이페이지
                                </span>
                            </Link>

                            <Link
                                href="/student/group-study"
                                onClick={() => setIsMypageChoiceOpen(false)}
                                className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-5 text-center transition hover:border-indigo-200 hover:bg-indigo-50/60"
                            >
                                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-500">
                                    <Users className="h-5 w-5" />
                                </span>
                                <span className="text-sm font-black text-slate-800">
                                    그룹 스터디
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
