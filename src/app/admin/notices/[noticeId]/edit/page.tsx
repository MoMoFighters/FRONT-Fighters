import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import AdminNoticeForm from "@/features/notice/components/admin/AdminNoticeForm";
import { getDummyNoticeDetail } from "@/features/notice/constants/dummyNotices";

interface AdminNoticeEditPageProps {
    params: Promise<{ noticeId: string }>;
}

export default async function AdminNoticeEditPage({
    params,
}: AdminNoticeEditPageProps) {
    const { noticeId } = await params;
    const notice = getDummyNoticeDetail(Number(noticeId));

    if (!notice) notFound();

    return (
        <div className="mx-auto w-full max-w-300 pb-10">
            <Link href={`/admin/notices/${notice.noticeId}`} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-950">
                <ArrowLeft className="size-4" />
                공지사항 상세로
            </Link>

            <div className="mt-6 mb-7">
                <div className="flex items-center gap-3">
                    <div className="h-7 w-1.5 rounded-full bg-indigo-500" />
                    <h1 className="text-2xl font-bold text-slate-950">공지 수정</h1>
                </div>
                <p className="mt-3 text-sm font-medium text-slate-500">등록된 공지사항 내용을 수정합니다.</p>
            </div>

            <AdminNoticeForm
                initialValues={{
                    noticeId: notice.noticeId,
                    title: notice.title,
                    content: notice.content.join("\n\n"),
                }}
            />
        </div>
    );
}
