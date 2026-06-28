import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";

import { getNoticeById } from "@/app/services/notice/service";
import AdminNoticeDetailActions from "@/features/notice/components/admin/AdminNoticeDetailActions";

interface AdminNoticeDetailPageProps {
    params: Promise<{ noticeId: string }>;
}

export default async function AdminNoticeDetailPage({
    params,
}: AdminNoticeDetailPageProps) {
    const { noticeId } = await params;
    const notice = await getNoticeById(noticeId);

    const formatAdminDateTime = (dateTime: string) => {
        return dateTime.replace("T", " ").slice(0, 16);
    };

    return (
        <div className="mx-auto w-full max-w-300 pb-10">
            <Link
                href="/admin/notices"
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-950"
            >
                <ArrowLeft className="size-4" />
                공지사항 목록으로
            </Link>

            <div className="mt-6 grid grid-cols-[minmax(0,1fr)_17rem] gap-6">
                <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                    <header className="border-b border-slate-200 px-7 py-6">
                        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600">공지사항</span>
                        <h1 className="mt-4 text-2xl font-bold leading-9 text-slate-950">{notice.title}</h1>
                        <div className="mt-5 flex items-center gap-5 text-sm font-medium text-slate-400">
                            <span className="flex items-center gap-1.5">
                                <CalendarDays className="size-4" />
                                {formatAdminDateTime(notice.createdAt)}
                            </span>
                        </div>
                    </header>
                    <div className="min-h-96 space-y-6 px-7 py-8 text-sm font-medium leading-7 text-slate-700">
                        <p className="whitespace-pre-line">{notice.content}</p>
                    </div>
                </article>

                <AdminNoticeDetailActions noticeId={notice.noticeId} />
            </div>
        </div>
    );
}
