"use client";

import { useEffect, useState } from "react";
import { Coins } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Fortune {
    id: number;
    content: string;
}

const FORTUNE_DOMAINS = [
    "학업", "우정", "건강", "재물", "가족", "여가", "새로운 만남", "목표 달성",
    "창의력", "커뮤니티 활동", "강의 수강", "휴식", "여행", "인간관계", "자기계발",
    "직감", "발표", "협업", "동아리 활동", "포인트 운",
];

const GOOD_TEMPLATES: ((domain: string) => string)[] = [
    (d) => `${d}에 큰 행운이 따르는 날`,
    (d) => `${d} 운이 활짝 열리는 하루`,
    (d) => `${d}에서 뜻하는 바를 이루기 좋은 시기`,
    (d) => `${d} 방면으로 좋은 기운이 가득한 하루`,
    (d) => `${d}에 대한 고민의 해답을 찾게 되는 날`,
    (d) => `${d}에서 작은 노력이 큰 결과로 이어지는 하루`,
    (d) => `${d}에 예상치 못한 행운이 찾아오는 날`,
    (d) => `${d}에 집중하면 만족스러운 결과를 얻는 하루`,
    (d) => `${d} 쪽에서 든든한 응원을 받게 되는 날`,
    (d) => `${d}에 새로운 기회가 열리는 하루`,
    (d) => `${d}에서 그동안의 노력이 빛을 발하는 순간`,
    (d) => `${d} 흐름이 순조로워 마음까지 편안해지는 하루`,
    (d) => `${d}에 좋은 인연이나 정보가 찾아오는 날`,
];

const NEUTRAL_TEMPLATES: ((domain: string) => string)[] = [
    (d) => `${d}에 특별한 변화 없이 평온하게 흘러가는 하루`,
    (d) => `${d} 운이 무난하여 평소처럼 임하면 되는 날`,
    (d) => `${d}에서 큰 기대도 큰 걱정도 필요 없는 잔잔한 하루`,
    (d) => `${d}에 있어 흐름에 맞춰 움직이면 되는 날`,
];

const BAD_TEMPLATES: ((domain: string) => string)[] = [
    (d) => `${d}에서 작은 실수가 생기기 쉬워 한 번 더 확인이 필요한 날`,
    (d) => `${d} 운이 다소 흐려 무리한 도전보다 신중함이 필요한 하루`,
];

const buildFortuneContents = (
    templates: ((domain: string) => string)[],
    count: number,
) =>
    FORTUNE_DOMAINS.flatMap((domain) =>
        templates.map((template) => template(domain)),
    ).slice(0, count);

/*
  총 366개(생년월일 연동을 고려해 1~366일에 대응). 좋은 내용 7 : 평범한 내용 2 : 안좋은 내용 1 비율.
*/
const FORTUNES: Fortune[] = [
    ...buildFortuneContents(GOOD_TEMPLATES, 256),
    ...buildFortuneContents(NEUTRAL_TEMPLATES, 73),
    ...buildFortuneContents(BAD_TEMPLATES, 37),
].map((content, index) => ({ id: index + 1, content }));

const THROW_DURATION_MS = 1100;

interface FortuneModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function FortuneModal({ open, onOpenChange }: FortuneModalProps) {
    const [phase, setPhase] = useState<"idle" | "throwing" | "result">("idle");
    const [fortune, setFortune] = useState<Fortune | null>(null);

    useEffect(() => {
        if (!open) {
            setPhase("idle");
            return;
        }

        setFortune(FORTUNES[Math.floor(Math.random() * FORTUNES.length)]);
        setPhase("throwing");

        const timer = setTimeout(() => {
            setPhase("result");
        }, THROW_DURATION_MS);

        return () => clearTimeout(timer);
    }, [open]);

    if (!open) {
        return null;
    }

    return (
        <>
            {phase === "throwing" && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/30 backdrop-blur-sm">
                    <Coins className="h-16 w-16 text-amber-400 drop-shadow-lg animate-coin-toss" />
                </div>
            )}

            <Dialog
                open={phase === "result"}
                onOpenChange={(nextOpen) => {
                    if (!nextOpen) {
                        onOpenChange(false);
                    }
                }}
            >
                <DialogContent className="text-center sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black text-slate-900">
                            오늘의 운세
                        </DialogTitle>
                        <DialogDescription className="pt-2 text-sm leading-6 text-slate-600">
                            오늘의 운세, {fortune?.content}입니다.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}
