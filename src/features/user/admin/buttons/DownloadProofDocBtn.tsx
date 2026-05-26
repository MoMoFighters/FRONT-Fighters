'use client'

import { User } from "@/app/admin/users/page";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

export default function DownloadProofDocBtn({ user }: { user: User }) {

    const handleDowloadProof = () => {
        try {
            // db의 user 에 들어있는 user.proof 받아서 파일로 주기
            console.log('증빙서류 다운로드 성공');
        } catch {
            toast.error('다운로드 실패!', {
                duration: 1000
            });
        }
    }

    return (
        <Button variant="ghost" onClick={handleDowloadProof} className="flex flex-col items-center text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:scale-[1.02] transition-all">
            <Download className="w-4 h-4" />
            <span className="text-xs">증빙서류</span>
        </Button>
    );
}