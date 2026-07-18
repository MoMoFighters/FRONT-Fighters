"use client";

import { toast } from "sonner";

import { MEMBERSHIP_PLANS } from "../membershipInfo";
import { MembershipPlan, MembershipTier } from "../type";
import MembershipPlanCard from "./MembershipPlanCard";

interface MembershipPlansProps {
    mode?: "student" | "guest";
    currentTier?: MembershipTier;
    membershipUntil?: string | null;
}

export default function MembershipPlans({
    mode = "student",
    currentTier = "BASIC",
    membershipUntil,
}: MembershipPlansProps) {
    const handleSelect = (plan: MembershipPlan) => {
        toast.info(`${plan.name} 플랜 전환은 준비 중인 기능입니다.`, {
            duration: 1500,
        });
    };

    return (
        <div className="grid grid-cols-3 gap-5">
            {MEMBERSHIP_PLANS.map((plan) => (
                <MembershipPlanCard
                    key={plan.tier}
                    plan={plan}
                    mode={mode}
                    currentTier={currentTier}
                    isActive={mode === "student" && plan.tier === currentTier}
                    membershipUntil={mode === "student" && plan.tier === currentTier ? membershipUntil : undefined}
                    onSelect={handleSelect}
                />
            ))}
        </div>
    );
}
