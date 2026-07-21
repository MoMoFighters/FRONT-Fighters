"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import MembershipRequiredModal from "@/features/chatbot/components/MembershipRequiredModal";
import type { Membership } from "@/features/user/type";

interface AskLectureAiButtonProps {
    href: string;
    membership: Membership;
}

const BUTTON_CLASSNAME =
    "absolute -top-12 -right-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition hover:bg-slate-50";

export default function AskLectureAiButton({ href, membership }: AskLectureAiButtonProps) {
    const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
    const gradientId = useId();
    const isPro = membership === "PRO";

    // lucide 아이콘은 stroke 기반이라, 숨겨진 linearGradient를 정의해두고 stroke로 참조해서 그라데이션을 낸다
    const icon = (
        <>
            <svg width="0" height="0" className="absolute">
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#4338ca" />
                    </linearGradient>
                </defs>
            </svg>
            <Sparkles className="h-5 w-5" stroke={`url(#${gradientId})`} />
        </>
    );

    return (
        <>
            <Tooltip>
                <TooltipTrigger asChild>
                    {isPro ? (
                        <Link href={href} aria-label="강의 요약 설명 물어보기" className={BUTTON_CLASSNAME}>
                            {icon}
                        </Link>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsMembershipModalOpen(true)}
                            aria-label="강의 요약 설명 물어보기"
                            className={BUTTON_CLASSNAME}
                        >
                            {icon}
                        </button>
                    )}
                </TooltipTrigger>

                <TooltipContent side="top">강의 요약 설명 물어보기</TooltipContent>
            </Tooltip>

            <MembershipRequiredModal open={isMembershipModalOpen} onOpenChange={setIsMembershipModalOpen} />
        </>
    );
}
