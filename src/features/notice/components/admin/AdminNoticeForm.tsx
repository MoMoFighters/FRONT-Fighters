"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { CircleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    createNoticeFormAction,
    NoticeActionState,
    updateNoticeFormAction,
} from "@/features/notice/action";

interface NoticeFormValues {
    noticeId?: number;
    title: string;
    content: string;
}

interface AdminNoticeFormProps {
    initialValues?: NoticeFormValues;
}

const INITIAL_ACTION_STATE: NoticeActionState = {
    success: false,
    message: "",
    errors: {},
};

export default function AdminNoticeForm({
    initialValues,
}: AdminNoticeFormProps) {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const isEditMode = Boolean(initialValues?.noticeId);
    const noticeId = String(initialValues?.noticeId ?? "");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const noticeFormAction = isEditMode
        ? updateNoticeFormAction.bind(null, noticeId)
        : createNoticeFormAction;

    const [state, formAction] = useActionState(
        noticeFormAction,
        INITIAL_ACTION_STATE,
    );
    const titleValue = state.values?.title ?? initialValues?.title ?? "";
    const contentValue = state.values?.content ?? initialValues?.content ?? "";

    useEffect(() => {
        if (!state.success) {
            return;
        }

        toast.success(isEditMode
            ? "공지사항이 수정되었습니다."
            : "공지사항이 등록되었습니다.");

        router.push(isEditMode ? `/admin/notices/${noticeId}` : "/admin/notices");
        router.refresh();
    }, [isEditMode, noticeId, router, state.success]);

    useEffect(() => {
        if (state.success || !state.message || state.errors) {
            return;
        }

        toast.error(state.message);
    }, [state.errors, state.message, state.success]);

    const handleConfirmSubmit = () => {
        // 확인 모달에서 승인한 뒤 실제 form action을 실행한다.
        setIsConfirmOpen(false);
        formRef.current?.requestSubmit();
    };

    return (
        <>
            <form
                ref={formRef}
                action={formAction}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
            >
                <div className="space-y-6 p-7">
                    <div>
                        <label
                            htmlFor="notice-title"
                            className="text-sm font-bold text-slate-700"
                        >
                            제목
                        </label>
                        <input
                            id="notice-title"
                            name="title"
                            defaultValue={titleValue}
                            placeholder="공지사항 제목을 입력하세요."
                            className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-3 focus:ring-indigo-50"
                        />

                        {state.errors?.title && (
                            <p className="mt-2 rounded-md bg-rose-50 px-3 py-2 text-xs font-bold text-rose-500">
                                {state.errors.title}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="notice-content"
                            className="text-sm font-bold text-slate-700"
                        >
                            내용
                        </label>
                        <textarea
                            id="notice-content"
                            name="content"
                            defaultValue={contentValue}
                            placeholder="회원에게 안내할 공지 내용을 입력하세요."
                            className="mt-2 min-h-96 w-full resize-y rounded-md border border-slate-200 bg-slate-50 p-4 text-sm font-medium leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-3 focus:ring-indigo-50"
                        />

                        {state.errors?.content && (
                            <p className="mt-2 rounded-md bg-rose-50 px-3 py-2 text-xs font-bold text-rose-500">
                                {state.errors.content}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50 px-7 py-4">
                    <Button
                        asChild
                        type="button"
                        variant="outline"
                        className="h-10 rounded-md border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 hover:bg-slate-100"
                    >
                        <Link href={isEditMode ? `/admin/notices/${initialValues?.noticeId}` : "/admin/notices"}>
                            취소
                        </Link>
                    </Button>

                    <SubmitButton
                        isEditMode={isEditMode}
                        onOpenConfirm={() => setIsConfirmOpen(true)}
                    />
                </div>
            </form>

            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogMedia className="bg-indigo-100 text-indigo-600">
                            <CircleAlert />
                        </AlertDialogMedia>
                        <AlertDialogTitle className="whitespace-pre-line">
                            {isEditMode ? "공지사항을 수정하시겠습니까?" : "공지사항을 등록하시겠습니까?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="whitespace-pre-line">
                            {isEditMode
                                ? "수정한 내용은 즉시 회원에게 표시됩니다."
                                : "등록한 공지사항은 즉시 회원에게 표시됩니다."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel variant="outline" className="cursor-pointer">
                            취소
                        </AlertDialogCancel>
                        <AlertDialogAction
                            variant="ghost"
                            onClick={handleConfirmSubmit}
                            className="bg-indigo-500 text-white hover:text-white! hover:bg-indigo-600!"
                        >
                            {isEditMode ? "수정" : "등록"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

function SubmitButton({
    isEditMode,
    onOpenConfirm,
}: {
    isEditMode: boolean;
    onOpenConfirm: () => void;
}) {
    const { pending } = useFormStatus();

    return (
        <Button
            type="button"
            disabled={pending}
            onClick={onOpenConfirm}
            className="h-10 min-w-24 rounded-md bg-indigo-500 px-4 text-sm font-bold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-200"
        >
            {pending
                ? isEditMode
                    ? "수정중..."
                    : "등록중..."
                : isEditMode
                    ? "수정 완료"
                    : "공지 등록"}
        </Button>
    );
}
