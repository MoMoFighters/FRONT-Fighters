"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Coins } from "lucide-react";

import coin from '@/app/assets/img/coin.png'
import pot from '@/app/assets/img/pot.png'

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

// 🍑 CSS의 coin-arc/coin-spin/coin-shadow 애니메이션 길이(1.1초)와 반드시 맞춰야 함 — 어긋나면 동전이 다 던져지기 전에 잘림 🍑
const THROW_DURATION_MS = 1100;

interface FortuneModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/* 🍑컨페티(Confetti) 효과 구현 안내:
외부 라이브러리 없이 경량화된 연출을 위해 20개의 컨페티 조각(div)을 dynamic style로 생성합니다.
결과(result) 단계가 되면 각 조각에 무작위 X/Y 이동 거리, 회전 각도, 색상, 애니메이션 지연 시간을 부여하여 
중앙 분수대로부터 퍼져나가는 듯한 입체적인 축하 효과를 연출합니다.🍑 */
interface ConfettiPiece {
    id: number;
    x: number;
    y: number;
    rotate: number;
    color: string;
    delay: number;
    size: number;
}

export default function FortuneModal({ open, onOpenChange }: FortuneModalProps) {
    const [phase, setPhase] = useState<"idle" | "throwing" | "result">("idle");
    const [fortune, setFortune] = useState<Fortune | null>(null);
    const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

    useEffect(() => {
        if (!open) {
            setPhase("idle");
            setConfetti([]);
            return;
        }

        setFortune(FORTUNES[Math.floor(Math.random() * FORTUNES.length)]);
        setPhase("throwing");

        const timer = setTimeout(() => {
            // 결과 단계로 넘어가기 전에 컨페티 데이터 먼저 생성
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

            // 다음 프레임에서 result 전환 → 동전 DOM이 먼저 완전히 제거됨
            requestAnimationFrame(() => {
                setPhase("result");
            });
        }, THROW_DURATION_MS);

        return () => clearTimeout(timer);
    }, [open]);

    if (!open) {
        return null;
    }

    /*
      🍑 핵심 수정: 컨페티가 Dialog 뒤에 묻히는 문제 해결
      CityCanvas가 container-type(containment)을 사용해 자체 스태킹 컨텍스트를 만들기 때문에,
      그 안에서 아무리 z-index를 높여도 document.body에 직접 포탈되는 Radix Dialog보다 위로 올라올 수 없음.
      → 동일하게 document.body로 포탈해서 같은 스태킹 컨텍스트에서 z-index가 비교되도록 함.
    */
    const overlay = (
        <>
            {/* 🍑 동전 던지는 연출(phase === "throwing") 동안에만 분수 배경 노출 🍑 */}
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
                        {/* 동전 그림자 이펙트 (포물선과 분리되어 바닥에 고정) */}
                        <div className="absolute top-12 h-4 w-12 rounded-[100%] bg-black/30 blur-md animate-coin-shadow" />

                        {/* 포물선(위치/크기/투명도) 담당 래퍼. perspective를 줘야 rotateX가 실제로 앞으로 텀블링하는 것처럼 입체적으로 보임 */}
                        <div className="animate-coin-arc [perspective:500px]">
                            {/* 회전(텀블링)만 담당 → 포물선과 다른 timing-function을 써도 서로 간섭하지 않음 */}
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

            {phase === "result" && (
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
                <DialogContent className="text-center sm:max-w-md z-[100]">
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
