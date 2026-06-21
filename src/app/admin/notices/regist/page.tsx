import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import AdminNoticeForm from "@/features/notice/components/admin/AdminNoticeForm";

export default function AdminNoticeRegistPage() {
    return (
        <div className="mx-auto w-full max-w-300 pb-10">
            <Link href="/admin/notices" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-950">
                <ArrowLeft className="size-4" />
                공지사항 목록으로
            </Link>

            <div className="mt-6 mb-7">
                <div className="flex items-center gap-3">
                    <div className="h-7 w-1.5 rounded-full bg-indigo-500" />
                    <h1 className="text-2xl font-bold text-slate-950">공지 등록</h1>
                </div>
                <p className="mt-3 text-sm font-medium text-slate-500">회원에게 전달할 공지사항을 작성합니다.</p>
            </div>

            <AdminNoticeForm />
        </div>
    );
}
