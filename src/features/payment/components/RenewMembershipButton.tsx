"use client";

import { useState } from "react";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { MembershipPlan } from "@/features/membership/type";
import PaymentMethodDialog from "@/features/payment/components/PaymentMethodDialog";

interface RenewMembershipButtonProps {
    plan: MembershipPlan;
    disabledReason?: string | null;
    membershipStart?: string | null;
}

export default function RenewMembershipButton({
    plan,
    disabledReason,
    membershipStart,
}: RenewMembershipButtonProps) {
    const [open, setOpen] = useState(false);
    const isDisabled = Boolean(disabledReason);

    const triggerButton = (
        <Button
            type="button"
            disabled={isDisabled}
            onClick={() => setOpen(true)}
            className="h-10 rounded-xl bg-indigo-500 text-sm font-bold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
        >
            갱신하기
        </Button>
    );

    if (isDisabled) {
        return (
            <HoverCard openDelay={100} closeDelay={0}>
                <HoverCardTrigger asChild>
                    <span className="inline-block cursor-not-allowed">
                        {triggerButton}
                    </span>
                </HoverCardTrigger>
                <HoverCardContent
                    side="top"
                    className="w-auto px-3 py-1.5 text-sm font-medium text-slate-600"
                >
                    {disabledReason}
                </HoverCardContent>
            </HoverCard>
        );
    }

    return (
        <>
            {triggerButton}
            <PaymentMethodDialog
                plan={plan}
                open={open}
                onOpenChange={setOpen}
                currentTier={plan.tier}
                membershipStart={membershipStart}
            />
        </>
    );
}
