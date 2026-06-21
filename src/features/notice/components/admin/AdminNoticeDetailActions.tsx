"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import DeleteModal from "@/features/modal/DeleteModal";

interface AdminNoticeDetailActionsProps {
    noticeId: number;
}

export default function AdminNoticeDetailActions({
    noticeId,
}: AdminNoticeDetailActionsProps) {
    const deleteNotice = () => {
        // TODO: 공지사항 삭제 API가 준비되면 noticeId를 전달한 뒤 목록으로 이동한다.
        toast.success("공지사항 삭제 요청이 처리되었습니다.");
    };

    return (
        <aside className="sticky top-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-950">공지 관리</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
                공지 내용을 수정하거나 더 이상 노출하지 않을 공지를 삭제합니다.
            </p>
            <div className="mt-4 space-y-2">
                <Button asChild className="h-9 w-full rounded-md bg-indigo-500 px-3 text-sm font-bold text-white hover:bg-indigo-600">
                    <Link href={`/admin/notices/${noticeId}/edit`}>
                        <Pencil className="size-4" />
                        공지 수정
                    </Link>
                </Button>
                <DeleteModal
                    trigger={(
                        <Button type="button" variant="outline" className="h-9 w-full rounded-md border-rose-200 px-3 text-sm font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700">
                            <Trash2 className="size-4" />
                            공지 삭제
                        </Button>
                    )}
                    title="공지사항을 삭제하시겠습니까?"
                    description="삭제한 공지사항은 되돌릴 수 없습니다."
                    onDelete={deleteNotice}
                />
            </div>
        </aside>
    );
}
