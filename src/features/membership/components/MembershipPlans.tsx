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

    // 카카오페이 결제창(IFRAME)이 열리고 닫힐 때 문서 높이가 바뀌면서 스크롤바가
    // 생겼다 사라졌다 하고, 그 폭만큼 레이아웃이 흔들리는 문제가 있었다.
    // 이 페이지에 머무는 동안만 스크롤바 자체를 숨겨서(스크롤 기능은 유지) 흔들림을 없앤다.
    useEffect(() => {
        document.documentElement.classList.add("no-page-scrollbar");

        return () => {
            document.documentElement.classList.remove("no-page-scrollbar");
        };
    }, []);

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

            // 결제창(IFRAME/POPUP)이 열려 있는 동안 다른 메뉴로 이동하는 등,
            // PaymentMethodDialog에서 이미 검증을 마쳤거나 만료된 paymentId로
            // 이 리다이렉트 재검증이 한 번 더 걸리는 경우가 있어 토스트는 띄우지 않는다.
            if (result.status !== 200 && result.status !== 201) {
                console.error("[MembershipPlans] 리다이렉트 결제 재검증 실패", result);
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
