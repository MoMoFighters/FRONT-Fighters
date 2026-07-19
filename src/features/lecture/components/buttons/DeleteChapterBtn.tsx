'use client'

import { Button } from "@/components/ui/button";
import DeleteModal from "@/features/modal/DeleteModal";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteChapterAction } from "../../action";

interface DeleteChapterBtnProps {
    lectureId: string;
    chapterId: number;
    mode: 'icon' | 'text';
    successHref?: string;
    onDeleted?: () => void;
}

export default function DeleteChapterBtn({
    lectureId,
    chapterId,
    mode,
    successHref,
    onDeleted,
}: DeleteChapterBtnProps) {
    const router = useRouter();

    const handleDeleteChapter = async () => {
        const result = await deleteChapterAction(lectureId, String(chapterId));

        if (!result.success) {
            toast.error(result.message ?? '챕터 삭제에 실패했습니다.', {
                duration: 1000
            });
            return;
        }

        toast.success(result.message ?? '챕터를 삭제했습니다.', {
            duration: 1000
        });

        onDeleted?.();

        if (successHref) {
            router.replace(successHref);
            return;
        }

        router.refresh();
    };

    return (
        <DeleteModal
            trigger={mode === 'icon' ? (
                <Button
                    variant="ghost"
                    size="icon"
                    className="
                        p-1.5 text-slate-400
                        hover:text-red-500
                        hover:bg-red-50
                        rounded-lg transition-all"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            ) : (
                <Button className="bg-red-400 cursor-pointer hover:bg-red-500 text-white font-bold text-sm py-2 px-4 rounded-xl!">삭제</Button>
            )}
            title="챕터를 삭제하시겠습니까?"
            description="삭제한 챕터는 되돌릴 수 없습니다."
            onDelete={handleDeleteChapter}
        />
    );
}
