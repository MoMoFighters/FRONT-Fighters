"use client";

import { useRouter } from "next/navigation";
import { Check, Crown, Info, Rocket, Sparkles } from "lucide-react";

import { formatMembershipUntil } from "@/components/common/MembershipBadge";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { calculateDisplayPrice } from "@/features/payment/proration";
import { MembershipPlan, MembershipTier } from "../type";
import { MEMBERSHIP_PLANS } from "../membershipInfo";

const TIER_ORDER: Record<MembershipTier, number> = {
    BASIC: 0,
    PLUS: 1,
    PRO: 2,
};

const TIER_ICON: Record<MembershipTier, typeof Sparkles> = {
    BASIC: Sparkles,
    PLUS: Rocket,
    PRO: Crown,
};

interface MembershipPlanCardProps {
    plan: MembershipPlan;
    mode?: "student" | "guest";
    currentTier?: MembershipTier;
    isActive?: boolean;
    membershipUntil?: string | null;
    membershipStart?: string | null;
    onSelect?: (plan: MembershipPlan) => void;
}

export default function MembershipPlanCard({
    plan,
    mode = "student",
    currentTier = "BASIC",
    isActive,
    membershipUntil,
    membershipStart,
    onSelect,
}: MembershipPlanCardProps) {
    const router = useRouter();
    const Icon = TIER_ICON[plan.tier];
    const isGuest = mode === "guest";
    const isCurrent = !isGuest && plan.tier === currentTier;
    const isUpgrade = TIER_ORDER[plan.tier] > TIER_ORDER[currentTier];
    const formattedMembershipUntil = formatMembershipUntil(membershipUntil);

    const isHighlighted = isActive;
    const discountPercent = plan.originalPrice
        ? Math.round((1 - plan.price / plan.originalPrice) * 100)
        : 0;

    const displayPrice =
        !isGuest && isUpgrade
            ? calculateDisplayPrice({
                currentTier,
                currentPrice: MEMBERSHIP_PLANS.find((p) => p.tier === currentTier)?.price ?? 0,
                targetTier: plan.tier,
                targetPrice: plan.price,
                membershipStart,
            })
            : plan.price;
    const isProrated = !isGuest && isUpgrade && displayPrice !== plan.price;

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

            {plan.originalPrice && discountPercent > 0 && (
                <div className="mt-4 flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-300 line-through">
                        ₩{plan.originalPrice.toLocaleString()}
                    </span>
                    <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-500">
                        {discountPercent}% 할인
                    </span>
                </div>
            )}

            <div className={`flex items-end gap-1 ${discountPercent > 0 ? "mt-1" : "mt-4"}`}>
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

            {isProrated ? (
                <HoverCard openDelay={100} closeDelay={0}>
                    <HoverCardTrigger asChild>
                        <button
                            type="button"
                            onClick={handleClick}
                            className="mt-6 flex h-11 w-full shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-indigo-500 text-sm font-bold text-white transition-colors hover:bg-indigo-600"
                        >
                            {`${plan.name}로 업그레이드`}
                            <Info className="h-3.5 w-3.5 opacity-70" />
                        </button>
                    </HoverCardTrigger>
                    <HoverCardContent
                        side="top"
                        className="w-auto px-3 py-1.5 text-sm font-medium text-slate-700"
                    >
                        지금 업그레이드하면 남은 이용 기간만큼만 계산되어{" "}
                        <span className="font-bold text-indigo-500">
                            약 ₩{displayPrice.toLocaleString()}
                        </span>
                        {"만 결제돼요."}
                    </HoverCardContent>
                </HoverCard>
            ) : (
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
                        ? `현재 플랜 ${formattedMembershipUntil ? `(~${formattedMembershipUntil})` : ``}`
                        : isGuest
                            ? `${plan.name}로 시작하기`
                            : isUpgrade
                                ? `${plan.name}로 업그레이드`
                                : `${plan.name}로 변경`}
                </button>
            )}

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
