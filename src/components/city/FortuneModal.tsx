"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { CloudDrizzle, CloudSun, Sparkles } from "lucide-react";

import coin from '@/app/assets/img/coin.png'
import pot from '@/app/assets/img/pot.png'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import OneButtonModal from "@/features/modal/OneButtonModal";
import { getFortuneAction } from "@/features/city/action";
import { Fortune, FortuneTone } from "@/features/city/type";

const THROW_DURATION_MS = 1100;

interface FortuneModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface ConfettiPiece {
    id: number;
    x: number;
    y: number;
    rotate: number;
    color: string;
    delay: number;
    size: number;
}

const TONE_THEME: Record<FortuneTone, {
    label: string;
    icon: typeof Sparkles;
    badgeClass: string;
    titleClass: string;
    gradientClass: string;
    descriptionClass: string;
}> = {
    GOOD: {
        label: "행운의 기운",
        icon: Sparkles,
        badgeClass: "bg-amber-100 text-amber-500",
        titleClass: "text-amber-600",
        gradientClass: "from-amber-50 via-white to-white",
        descriptionClass: "text-slate-700",
    },
    NEUTRAL: {
        label: "평온한 하루",
        icon: CloudSun,
        badgeClass: "bg-sky-100 text-sky-500",
        titleClass: "text-slate-900",
        gradientClass: "from-sky-50 via-white to-white",
        descriptionClass: "text-slate-600",
    },
    BAD: {
        label: "차분함이 필요한 하루",
        icon: CloudDrizzle,
        badgeClass: "bg-slate-200 text-slate-500",
        titleClass: "text-slate-600",
        gradientClass: "from-slate-100 via-white to-white",
        descriptionClass: "text-slate-500",
    },
};

export default function FortuneModal({ open, onOpenChange }: FortuneModalProps) {
    const [phase, setPhase] = useState<"idle" | "throwing" | "result" | "error">("idle");
    const [fortune, setFortune] = useState<Fortune | null>(null);
    const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!open) {
            setPhase("idle");
            setConfetti([]);
            setFortune(null);
            setErrorMessage("");
            return;
        }

        let isCancelled = false;
        setPhase("throwing");

        const fortunePromise = getFortuneAction();

        const timer = setTimeout(async () => {
            const result = await fortunePromise;

            if (isCancelled) {
                return;
            }

            if (!result.success || !result.data) {
                setErrorMessage(result.message || "운세를 불러오지 못했습니다.");
                setPhase("error");
                return;
            }

            setFortune(result.data);

            if (result.data.tone !== "BAD") {
                const colors = [
                    "#f59e0b", "#fbbf24", "#3b82f6", "#60a5fa",
                    "#ec4899", "#f43f5e", "#a855f7", "#10b981", "#ffffff"
                ];

                const pieces: ConfettiPiece[] = Array.from({ length: 50 }).map((_, i) => {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = 180 + Math.random() * 320;

                    return {
                        id: i,
                        x: Math.cos(angle) * distance,
                        y: Math.sin(angle) * distance - 80,
                        rotate: (Math.random() - 0.5) * 1440,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        delay: Math.random() * 0.15,
                        size: 6 + Math.random() * 10,
                    };
                });

                setConfetti(pieces);
            }

            // 다음 프레임에서 result 전환 → 동전 DOM이 먼저 완전히 제거됨
            requestAnimationFrame(() => {
                if (!isCancelled) {
                    setPhase("result");
                }
            });
        }, THROW_DURATION_MS);

        return () => {
            isCancelled = true;
            clearTimeout(timer);
        };
    }, [open]);

    if (!open) {
        return null;
    }

    const overlay = (
        <>
            {phase === "throwing" && (
                <div className="fixed inset-0 z-[60] overflow-hidden">
                    <div className="p-20% h-full w-full">
                        <Image
                            src={pot}
                            alt="분수대 배경"
                            fill
                            priority
                            className="object-cover filter blur-sm scale-105"
                        />
                    </div>
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" />
                </div>
            )}

            {phase === "throwing" && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute top-12 h-4 w-12 rounded-[100%] bg-black/30 blur-md animate-coin-shadow" />

                        <div className="animate-coin-arc [perspective:500px]">
                            <Image
                                height={80}
                                width={80}
                                alt="coin"
                                src={coin}
                                className="animate-coin-spin transform-gpu drop-shadow-[0_12px_12px_rgba(0,0,0,0.4)]"
                            />
                        </div>
                    </div>
                </div>
            )}

            {phase === "result" && confetti.length > 0 && (
                <div className="fixed inset-0 z-[101] pointer-events-none flex items-center justify-center overflow-hidden">
                    {confetti.map((item) => (
                        <span
                            key={item.id}
                            className="absolute rounded-sm animate-confetti-pop will-change-transform will-change-opacity"
                            style={{
                                width: `${item.size}px`,
                                height: `${item.size * 1.4}px`,
                                backgroundColor: item.color,
                                ["--tw-translate-x" as string]: `${item.x}px`,
                                ["--tw-translate-y" as string]: `${item.y}px`,
                                ["--tw-rotate" as string]: `${item.rotate}deg`,
                                animationDelay: `${item.delay}s`,
                            }}
                        />
                    ))}
                </div>
            )}
        </>
    );

    const theme = fortune ? TONE_THEME[fortune.tone] : null;
    const ToneIcon = theme?.icon;

    return (
        <>
            {typeof document !== "undefined" && createPortal(overlay, document.body)}

            <Dialog
                open={phase === "result"}
                onOpenChange={(nextOpen) => {
                    if (!nextOpen) {
                        onOpenChange(false);
                    }
                }}
            >
                <DialogContent className="text-center sm:max-w-md z-[100] overflow-hidden">
                    {theme && ToneIcon && (
                        <div className={`-m-4 mb-0 bg-gradient-to-b ${theme.gradientClass} px-4 pb-2 pt-6`}>
                            <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${theme.badgeClass}`}>
                                <ToneIcon className="h-6 w-6" />
                            </div>

                            <DialogHeader>
                                <DialogTitle className={`text-xl font-black ${theme.titleClass}`}>
                                    오늘의 운세
                                </DialogTitle>

                                <DialogDescription className={`pt-2 pb-4 text-sm leading-6 ${theme.descriptionClass}`}>
                                    {fortune?.content}
                                </DialogDescription>
                            </DialogHeader>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <OneButtonModal
                open={phase === "error"}
                onOpenChange={(nextOpen) => {
                    if (!nextOpen) {
                        onOpenChange(false);
                    }
                }}
                title="운세를 볼 수 없어요"
                description={errorMessage}
                onConfirm={() => onOpenChange(false)}
            />
        </>
    );
}
