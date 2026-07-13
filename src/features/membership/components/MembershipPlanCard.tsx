"use client";

import { useRouter } from "next/navigation";
import { Check, Crown, Rocket, Sparkles } from "lucide-react";

import { MembershipPlan, MembershipTier } from "../type";

const TIER_ORDER: Record<MembershipTier, number> = {
    BASIC: 0,
    PRO: 1,
    PLUS: 2,
};

const TIER_ICON: Record<MembershipTier, typeof Sparkles> = {
    BASIC: Sparkles,
    PRO: Rocket,
    PLUS: Crown,
};

interface MembershipPlanCardProps {
    plan: MembershipPlan;
    mode?: "student" | "guest";
    currentTier?: MembershipTier;
    isActive?: boolean;
    endAt?: string | null;
    onSelect?: (plan: MembershipPlan) => void;
}

export default function MembershipPlanCard({
    plan,
    mode = "student",
    currentTier = "BASIC",
    isActive,
    endAt,
    onSelect,
}: MembershipPlanCardProps) {
    const router = useRouter();
    const Icon = TIER_ICON[plan.tier];
    const isGuest = mode === "guest";
    const isCurrent = !isGuest && plan.tier === currentTier;
    const isUpgrade = TIER_ORDER[plan.tier] > TIER_ORDER[currentTier];

    const isHighlighted = isActive;

    const handleClick = () => {
        if (isGuest) {
            router.push("/auth/login");
            return;
        }

        onSelect?.(plan);
    };

    return (
        <div
            className={`relative flex flex-col rounded-3xl border p-6 shadow-sm transition ${isHighlighted
                ? "border-indigo-200 bg-indigo-50/40 ring-1 ring-indigo-100"
                : "border-slate-200 bg-white"
                }`}
        >
            {isActive && (
                <span className="absolute right-6 top-6 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-500">
                    적용됨
                </span>
            )}

            <div
                className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isHighlighted
                    ? "bg-indigo-500 text-white"
                    : "bg-slate-100 text-slate-500"
                    }`}
            >
                <Icon className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-xl font-black text-slate-900">
                {plan.name}
            </h3>

            <div className="mt-4 flex items-end gap-1">
                <span className="text-3xl font-black tracking-tight text-slate-900">
                    ₩{plan.price.toLocaleString()}
                </span>
                <span className="pb-1 text-sm font-bold text-slate-400">
                    /월
                </span>
            </div>

            <p className="mt-2 text-sm font-medium text-slate-500">
                {plan.description}
            </p>

            <button
                type="button"
                disabled={isCurrent}
                onClick={handleClick}
                className={`mt-6 flex h-11 w-full shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors ${isCurrent
                    ? "cursor-not-allowed bg-slate-100 text-slate-400"
                    : "bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer"
                    }`}
            >
                {isCurrent
                    ? `현재 플랜 ${endAt ? `(~${endAt})` : ``}`
                    : isGuest
                        ? `${plan.name}로 시작하기`
                        : isUpgrade
                            ? `${plan.name}로 업그레이드`
                            : `${plan.name}로 변경`}
            </button>

            <ul className="mt-6 flex flex-1 flex-col gap-3">
                {plan.features.map((feature) => (
                    <li
                        key={feature}
                        className="flex items-start gap-2 text-sm font-medium text-slate-600"
                    >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                        {feature}
                    </li>
                ))}
            </ul>
        </div>
    );
}
