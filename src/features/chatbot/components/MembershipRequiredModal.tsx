"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogPortal, DialogTitle } from "@/components/ui/dialog";

interface MembershipRequiredModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onBeforeRedirect?: () => void;
}

export default function MembershipRequiredModal({
    open,
    onOpenChange,
    onBeforeRedirect,
}: MembershipRequiredModalProps) {
    const router = useRouter();

    const handleConfirm = () => {
        onBeforeRedirect?.();
        router.push("/student/mypage/membership");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
            {/* modal={false}면 Radix가 기본 오버레이를 렌더링하지 않아서 뒷배경 블러를 직접 그려준다 */}
            <DialogPortal>
                <div
                    onClick={() => onOpenChange(false)}
                    className="fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs"
                />
            </DialogPortal>

            <DialogContent showCloseButton={false} className="w-fit p-6 text-center">
                <DialogTitle className="sr-only">멤버십 업그레이드 안내</DialogTitle>

                <DialogDescription className="whitespace-pre-line text-sm text-slate-600">
                    {"멤버십 플랜 업그레이드 후\n이용이 가능합니다."}
                </DialogDescription>

                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        className="bg-indigo-500 px-6 text-white hover:bg-indigo-600! hover:text-white!"
                        onClick={handleConfirm}
                    >
                        확인
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
