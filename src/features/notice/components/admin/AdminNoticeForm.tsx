"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface NoticeFormValues {
    noticeId?: number;
    title: string;
    content: string;
}

interface AdminNoticeFormProps {
    initialValues?: NoticeFormValues;
}

export default function AdminNoticeForm({
    initialValues,
}: AdminNoticeFormProps) {
    const router = useRouter();
    const isEditMode = Boolean(initialValues?.noticeId);
    const [title, setTitle] = useState(initialValues?.title ?? "");
    const [content, setContent] = useState(initialValues?.content ?? "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!title.trim() || !content.trim()) {
            toast.error("제목과 내용을 모두 입력해주세요.");
            return;
        }

        setIsSubmitting(true);

        try {
            // TODO: 공지사항 등록/수정 API가 준비되면 initialValues?.noticeId 기준으로 요청을 분기한다.
            toast.success(isEditMode ? "공지사항 수정 요청이 처리되었습니다." : "공지사항 등록 요청이 처리되었습니다.");
            router.push("/admin/notices");
            router.refresh();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={submit} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="space-y-6 p-7">
                <div>
                    <label htmlFor="notice-title" className="text-sm font-bold text-slate-700">제목</label>
                    <input
                        id="notice-title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="공지사항 제목을 입력하세요."
                        className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-3 focus:ring-indigo-50"
                    />
                </div>

                <div>
                    <label htmlFor="notice-content" className="text-sm font-bold text-slate-700">내용</label>
                    <textarea
                        id="notice-content"
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        placeholder="회원에게 안내할 공지 내용을 입력하세요."
                        className="mt-2 min-h-96 w-full resize-y rounded-md border border-slate-200 bg-slate-50 p-4 text-sm font-medium leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-3 focus:ring-indigo-50"
                    />
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50 px-7 py-4">
                <Button asChild type="button" variant="outline" className="h-10 rounded-md border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 hover:bg-slate-100">
                    <Link href={isEditMode ? `/admin/notices/${initialValues?.noticeId}` : "/admin/notices"}>취소</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting} className="h-10 rounded-md bg-indigo-500 px-4 text-sm font-bold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-200">
                    {isEditMode ? "수정 완료" : "공지 등록"}
                </Button>
            </div>
        </form>
    );
}
