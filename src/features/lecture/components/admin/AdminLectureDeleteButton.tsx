"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import DeleteModal from "@/features/modal/DeleteModal";
import {
    deleteChapterAction,
    deleteLectureAction,
    deleteReviewAction,
} from "@/features/lecture/action";

interface AdminLectureDeleteButtonProps {
    target: "강의" | "챕터" | "수강평";
    targetId: number;
    lectureId?: string | number;
    variant?: "icon" | "button" | "text";
    successHref?: string;
}

export default function AdminLectureDeleteButton({
    target,
    targetId,
    lectureId,
    variant = "icon",
    successHref,
}: AdminLectureDeleteButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            const result = target === "강의"
                ? await deleteLectureAction(String(targetId))
                : target === "챕터"
                    ? await deleteChapterAction(String(lectureId), String(targetId))
                    : await deleteReviewAction(String(lectureId), String(targetId));

            if (!result.success) {
                toast.error(result.message ?? `${target} 삭제에 실패했습니다.`);
                return;
            }

            toast.success(result.message ?? `${target}을 삭제했습니다.`);

            if (successHref) {
                router.replace(successHref);
            }

            router.refresh();
        });
    };

    const trigger = variant === "button" ? (
        <Button
            type="button"
            disabled={isPending}
            className="h-10 rounded-xl bg-rose-600 px-4 text-sm font-bold text-white hover:bg-rose-700"
        >
            <Trash2 className="size-4" />
            {isPending ? "삭제중..." : `${target} 삭제`}
        </Button>
    ) : variant === "text" ? (
        <Button
            type="button"
            variant="outline"
            disabled={isPending}
            className="h-10 rounded-md border-rose-200 bg-white px-4 text-sm font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700"
        >
            <Trash2 className="size-4" />
            {isPending ? "삭제중..." : "삭제하기"}
        </Button>
    ) : (
        <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={isPending}
            aria-label={`${target} 삭제`}
            className="rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600"
        >
            <Trash2 className="size-4" />
        </Button>
    );

    return (
        <DeleteModal
            trigger={trigger}
            title={`${target}을 삭제하시겠습니까?`}
            description={`삭제한 ${target}은 되돌릴 수 없습니다.`}
            onDelete={handleDelete}
        />
    );
}
