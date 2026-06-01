'use client'

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { UserResponse } from "../../type";

export default function DownloadProofDocBtn({
    user
}: {
    user: UserResponse;
}) {

    const handleOpenProof = () => {

        if (!user.proof) {
            toast.error(
                '증빙서류가 존재하지 않습니다.'
            );
            return;
        }

        window.open(
            user.proof,
            '_blank',
            'noopener,noreferrer'
        );
    };

    return (
        <Button
            variant="ghost"
            onClick={handleOpenProof}
            className="flex flex-col items-center text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:scale-[1.02] transition-all"
        >
            <Download className="w-4 h-4" />
            <span className="text-xs">
                증빙서류
            </span>
        </Button>
    );
}