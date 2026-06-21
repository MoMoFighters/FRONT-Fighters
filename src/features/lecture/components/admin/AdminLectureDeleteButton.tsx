"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import DeleteModal from "@/features/modal/DeleteModal";

interface AdminLectureDeleteButtonProps {
    target: "강의" | "챕터" | "수강평";
    targetId: number;
    variant?: "icon" | "button";
}

export default function AdminLectureDeleteButton({
    target,
    targetId,
    variant = "icon",
}: AdminLectureDeleteButtonProps) {
    const handleDelete = async () => {
        // TODO: 관리자 강의/챕터/수강평 삭제 API가 준비되면 target과 targetId에 맞는 요청을 연결한다.
        toast.success(`${target} 삭제 요청이 처리되었습니다.`);
    };

    const trigger = variant === "button" ? (
        <Button
            type="button"
            className="h-10 rounded-xl bg-rose-600 px-4 text-sm font-bold text-white hover:bg-rose-700"
        >
            <Trash2 className="size-4" />
            {target} 삭제
        </Button>
    ) : (
        <Button
            type="button"
            variant="ghost"
            size="icon-sm"
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
