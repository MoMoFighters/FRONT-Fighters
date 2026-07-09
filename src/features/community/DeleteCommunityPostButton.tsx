"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import DeleteModal from "@/features/modal/DeleteModal";
import { deleteCommunityPostAction } from "@/features/community/action";

interface DeleteCommunityPostButtonProps {
    postId: number;
    successHref: string;
    trigger?: ReactNode;
}

const isSuccessResponse = (status: number) =>
    status >= 200 && status < 300;

export default function DeleteCommunityPostButton({
    postId,
    successHref,
    trigger,
}: DeleteCommunityPostButtonProps) {
    const router = useRouter();

    const handleDelete = async () => {
        const response =
            await deleteCommunityPostAction(postId);

        if (!isSuccessResponse(response.status)) {
            toast.error(response.message || "게시글 삭제에 실패했습니다.");
            return;
        }

        toast.success("게시글을 삭제했습니다.");
        router.push(successHref);
        router.refresh();
    };

    return (
        <DeleteModal
            title="게시글 삭제"
            description="삭제한 게시글은 다시 볼 수 없습니다."
            onDelete={handleDelete}
            trigger={trigger ?? (
                <button
                    type="button"
                    className="cursor-pointer rounded-md border border-rose-200 px-2.5 py-1 text-xs font-bold text-rose-500 transition hover:bg-rose-50"
                    aria-label="게시글 삭제"
                    title="게시글 삭제"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            )}
        />
    );
}
