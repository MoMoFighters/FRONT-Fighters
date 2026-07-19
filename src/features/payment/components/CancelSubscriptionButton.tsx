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
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { cancelPaymentAction } from "@/features/payment/action";

interface CancelSubscriptionButtonProps {
    paymentId?: string;
    disabledReason?: string | null;
}

export default function CancelSubscriptionButton({
    paymentId,
    disabledReason,
}: CancelSubscriptionButtonProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCancel = async () => {
        if (isSubmitting) {
            return;
        }

        if (!paymentId) {
            toast.error(
                "결제 정보를 확인할 수 없어 구독을 취소할 수 없습니다. 관리자에게 문의해주세요."
            );
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await cancelPaymentAction(paymentId);

            if (result.status !== 200) {
                toast.error(result.message || "구독 취소에 실패했습니다.");
                return;
            }

            toast.success(result.message || "구독이 취소되었습니다.");
            setOpen(false);
            router.refresh();
        } finally {
            setIsSubmitting(false);
        }
    };

    const isDisabled = Boolean(disabledReason);

    const triggerButton = (
        <Button
            type="button"
            variant="outline"
            disabled={isDisabled}
            onClick={() => setOpen(true)}
            className="h-10 rounded-xl border-rose-200 text-sm font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:hover:bg-transparent"
        >
            구독 취소
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
                    className="w-auto px-3 py-1.5 text-sm font-medium text-rose-500"
                >
                    {disabledReason}
                </HoverCardContent>
            </HoverCard>
        );
    }

    return (
        <>
            {triggerButton}

            <Dialog open={open} onOpenChange={(next) => !isSubmitting && setOpen(next)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>구독을 취소할까요?</DialogTitle>
                        <DialogDescription>
                            결제 후 3일 이내에만 환불이 가능합니다. 3일이 지난
                            경우 환불은 불가능하며, 현재 플랜을 이용 기간이
                            끝날 때까지 유지하다가 자동으로 BASIC으로
                            전환됩니다.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isSubmitting}
                            onClick={() => setOpen(false)}
                        >
                            닫기
                        </Button>
                        <Button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => void handleCancel()}
                            className="bg-rose-500 text-white hover:bg-rose-600"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "구독 취소하기"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
