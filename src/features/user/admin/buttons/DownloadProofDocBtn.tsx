import { User } from "@/app/admin/users/page";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function DownloadProofDocBtn({ user }: { user: User }) {

    // db의 user 에 들어있는 user.proof 받아서 파일로 주기

    return (
        <Button variant="ghost" className="flex items-center gap-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:scale-[1.02] transition-all">
            <Download className="w-5 h-5" />
            <span className="text-sm">증빙서류</span>
        </Button>
    );
}