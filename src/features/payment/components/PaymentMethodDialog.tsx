"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MembershipPlan } from "@/features/membership/type";
import { preparePaymentAction, verifyPaymentAction } from "@/features/payment/action";
import {
    PORTONE_CHANNEL_KEY,
    PORTONE_EASY_PAY_PROVIDER,
    PORTONE_STORE_ID,
    PortOneEasyPayProvider,
} from "@/features/payment/config";

interface PaymentMethodDialogProps {
    plan: MembershipPlan | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const PAYMENT_METHODS: { provider: PortOneEasyPayProvider; label: string }[] = [
    { provider: PORTONE_EASY_PAY_PROVIDER.KAKAOPAY, label: "카카오페이" },
    { provider: PORTONE_EASY_PAY_PROVIDER.TOSSPAY, label: "토스페이" },
];

export default function PaymentMethodDialog({
    plan,
    open,
    onOpenChange,
}: PaymentMethodDialogProps) {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleClose = (nextOpen: boolean) => {
        if (isProcessing) {
            return;
        }

        onOpenChange(nextOpen);
    };

    const handlePay = async (provider: PortOneEasyPayProvider) => {
        if (!plan || isProcessing) {
            return;
        }

        setIsProcessing(true);

        try {
            const prepareResult = await preparePaymentAction(plan.tier);

            if (
                prepareResult.status !== 200 &&
                prepareResult.status !== 201
            ) {
                toast.error(
                    prepareResult.message || "결제 준비 중 오류가 발생했습니다."
                );
                return;
            }

            const paymentId = prepareResult.data?.paymentId;
            const totalAmount = prepareResult.data?.price;

            if (!paymentId || totalAmount === undefined) {
                toast.error("결제 준비 정보를 불러오지 못했습니다.");
                return;
            }

            const PortOne = (await import("@portone/browser-sdk/v2")).default;

            const redirectUrl =
                `${window.location.origin}/student/mypage/membership` +
                `?paymentId=${encodeURIComponent(paymentId)}`;

            const response = await PortOne.requestPayment({
                storeId: PORTONE_STORE_ID,
                channelKey: PORTONE_CHANNEL_KEY[provider],
                paymentId,
                orderName: `${plan.name} 플랜 구독`,
                totalAmount,
                currency: "KRW",
                payMethod: "EASY_PAY",
                easyPay: { easyPayProvider: provider },
                windowType: {
                    pc: "IFRAME",
                    mobile: "REDIRECTION",
                },
                redirectUrl,
            });

            // 모바일 REDIRECTION 방식은 페이지 이동으로 처리되므로
            // 이 아래 로직은 PC(IFRAME/POPUP) 응답에만 도달한다.
            if (!response || response.code) {
                toast.error(
                    response?.message || "결제가 취소되었거나 실패했습니다."
                );
                return;
            }

            const verifyResult = await verifyPaymentAction(paymentId);

            if (verifyResult.status !== 200 && verifyResult.status !== 201) {
                toast.error(
                    verifyResult.message || "결제 검증에 실패했습니다."
                );
                return;
            }

            toast.success(verifyResult.message || "결제가 완료되었습니다.");
            onOpenChange(false);
            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "결제 처리 중 오류가 발생했습니다."
            );
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {plan ? `${plan.name} 플랜 결제` : "플랜 결제"}
                    </DialogTitle>
                    <DialogDescription>
                        {plan
                            ? `₩${plan.price.toLocaleString()}/월 · 결제 수단을 선택해주세요.`
                            : "결제 수단을 선택해주세요."}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-2">
                    {PAYMENT_METHODS.map((method) => (
                        <Button
                            key={method.provider}
                            type="button"
                            variant="outline"
                            disabled={isProcessing}
                            onClick={() => void handlePay(method.provider)}
                            className="h-12 w-full justify-center rounded-xl text-sm font-bold"
                        >
                            {isProcessing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                `${method.label}로 결제하기`
                            )}
                        </Button>
                    ))}
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isProcessing}
                        onClick={() => handleClose(false)}
                    >
                        취소
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
