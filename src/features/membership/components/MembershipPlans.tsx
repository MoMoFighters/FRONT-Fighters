"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { MEMBERSHIP_PLANS } from "../membershipInfo";
import { MembershipPlan, MembershipTier } from "../type";
import MembershipPlanCard from "./MembershipPlanCard";
import PaymentMethodDialog from "@/features/payment/components/PaymentMethodDialog";
import { verifyPaymentAction } from "@/features/payment/action";

interface MembershipPlansProps {
    mode?: "student" | "guest";
    currentTier?: MembershipTier;
    membershipUntil?: string | null;
    membershipStart?: string | null;
}

export default function MembershipPlans({
    mode = "student",
    currentTier = "BASIC",
    membershipUntil,
    membershipStart,
}: MembershipPlansProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
    const hasVerifiedRedirectRef = useRef(false);

    // 모바일 결제(REDIRECTION)는 결제 완료 후 이 페이지로 되돌아온다.
    // paymentId가 붙어 있으면 서버에 재검증을 요청한다.
    useEffect(() => {
        const pendingPaymentId = searchParams.get("paymentId");

        if (
            mode !== "student" ||
            !pendingPaymentId ||
            hasVerifiedRedirectRef.current
        ) {
            return;
        }

        hasVerifiedRedirectRef.current = true;

        void (async () => {
            const result = await verifyPaymentAction(pendingPaymentId);

            if (result.status !== 200 && result.status !== 201) {
                toast.error(result.message || "결제 검증에 실패했습니다.");
            }

            router.replace(pathname);
            router.refresh();
        })();
    }, [mode, pathname, router, searchParams]);

    const handleSelect = (plan: MembershipPlan) => {
        if (plan.price === 0) {
            toast.info(
                "BASIC은 무료 플랜이라 결제가 필요 없어요. 구독을 해지하려면 마이페이지 > 결제 내역에서 구독을 취소해주세요.",
                { duration: 2500 }
            );
            return;
        }

        setSelectedPlan(plan);
    };

    return (
        <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {MEMBERSHIP_PLANS.map((plan) => (
                    <MembershipPlanCard
                        key={plan.tier}
                        plan={plan}
                        mode={mode}
                        currentTier={currentTier}
                        isActive={mode === "student" && plan.tier === currentTier}
                        membershipUntil={mode === "student" && plan.tier === currentTier ? membershipUntil : undefined}
                        membershipStart={membershipStart}
                        onSelect={handleSelect}
                    />
                ))}
            </div>

            <PaymentMethodDialog
                plan={selectedPlan}
                open={selectedPlan !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedPlan(null);
                    }
                }}
                currentTier={currentTier}
                membershipStart={membershipStart}
            />
        </>
    );
}
