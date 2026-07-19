"use client";

import { useRef, useState } from "react";
import Image from "next/image";
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
import kakaoPayLogo from "@/app/assets/img/kakaoPay.png";
import tossPayLogo from "@/app/assets/img/tossPay.png";

interface PaymentMethodDialogProps {
    plan: MembershipPlan | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const PAYMENT_METHODS: {
    provider: PortOneEasyPayProvider;
    label: string;
    logo: typeof kakaoPayLogo;
    logoClassName: string;
    buttonClassName: string;
    textClassName: string;
    // PG사마다 PC에서 지원하는 결제창 유형이 달라서 (토스페이는 IFRAME 미지원) 개별 지정한다.
    pcWindowType: "IFRAME" | "POPUP" | "REDIRECTION";
}[] = [
        {
            provider: PORTONE_EASY_PAY_PROVIDER.KAKAOPAY,
            label: "카카오페이",
            logo: kakaoPayLogo,
            logoClassName: "h-6 w-auto",
            buttonClassName:
                "cursor-pointer border border-[#F4DC34] bg-[#F4DC34] hover:border-[#3C1E1E]/30 hover:-translate-y-0.5 focus-visible:ring-[#F4DC34]/50",
            textClassName: "text-[#3C1E1E]",
            pcWindowType: "IFRAME",
        },
        {
            provider: PORTONE_EASY_PAY_PROVIDER.TOSSPAY,
            label: "토스페이",
            logo: tossPayLogo,
            logoClassName: "h-6 w-auto",
            buttonClassName:
                "cursor-pointer border border-[#1B64DA]/25 bg-white hover:border-[#1B64DA] hover:-translate-y-0.5 focus-visible:ring-[#1B64DA]/30",
            textClassName: "text-[#1B64DA]",
            pcWindowType: "POPUP",
        },
    ];

export default function PaymentMethodDialog({
    plan,
    open,
    onOpenChange,
}: PaymentMethodDialogProps) {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const attemptIdRef = useRef(0);

    const handleClose = (nextOpen: boolean) => {
        if (!nextOpen && isProcessing) {
            // 결제창(카카오/토스 iframe)이 응답 없이 멈추는 경우를 대비해,
            // 진행 중이어도 항상 닫을 수 있게 하고 이후 응답은 무시한다.
            attemptIdRef.current += 1;
            setIsProcessing(false);
            toast.info(
                "결제 창을 닫았습니다. \"이미 진행 중인 결제가 있습니다\" 오류가 뜬다면 잠시 후 다시 시도해주세요."
            );
        }

        onOpenChange(nextOpen);
    };

    const handlePay = async (
        provider: PortOneEasyPayProvider,
        pcWindowType: "IFRAME" | "POPUP" | "REDIRECTION"
    ) => {
        if (!plan || isProcessing) {
            return;
        }

        const attemptId = ++attemptIdRef.current;
        const isStale = () => attemptId !== attemptIdRef.current;

        setIsProcessing(true);

        try {
            const prepareResult = await preparePaymentAction(plan.tier);

            if (isStale()) {
                return;
            }

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

            if (isStale()) {
                return;
            }

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
                    pc: pcWindowType,
                    mobile: "REDIRECTION",
                },
                redirectUrl,
            });

            if (isStale()) {
                return;
            }

            // 모바일 REDIRECTION 방식은 페이지 이동으로 처리되므로
            // 이 아래 로직은 PC(IFRAME/POPUP) 응답에만 도달한다.
            if (!response || response.code) {
                toast.error(
                    response?.message || "결제가 취소되었거나 실패했습니다."
                );
                return;
            }

            const verifyResult = await verifyPaymentAction(paymentId);

            if (isStale()) {
                return;
            }

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
            if (isStale()) {
                return;
            }

            toast.error(
                error instanceof Error
                    ? error.message
                    : "결제 처리 중 오류가 발생했습니다."
            );
        } finally {
            if (!isStale()) {
                setIsProcessing(false);
            }
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

                <div className="flex flex-col gap-3">
                    {PAYMENT_METHODS.map((method) => (
                        <Button
                            key={method.provider}
                            type="button"
                            disabled={isProcessing}
                            onClick={() => void handlePay(method.provider, method.pcWindowType)}
                            className={`h-14 w-full justify-center gap-2.5 rounded-2xl text-sm font-bold shadow-none transition-all duration-150 ${method.buttonClassName}`}
                        >
                            {isProcessing ? (
                                <Loader2
                                    className={`h-4 w-4 animate-spin ${method.textClassName}`}
                                />
                            ) : (
                                <>
                                    <Image
                                        src={method.logo}
                                        alt={method.label}
                                        className={`${method.logoClassName} object-contain`}
                                    />
                                    <span className={method.textClassName}>
                                        결제하기
                                    </span>
                                </>
                            )}
                        </Button>
                    ))}
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleClose(false)}
                    >
                        {isProcessing ? "닫기" : "취소"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
