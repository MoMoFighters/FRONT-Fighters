'use client'

import { Button } from "@/components/ui/button";
import DeleteModal from "@/features/modal/DeleteModal";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteLectureAction } from "../../action";

interface DeleteLectureBtnProps {
    id: number;
    mode: 'icon' | 'text';
}

export default function DeleteLectureBtn({
    id,
    mode,
}: DeleteLectureBtnProps) {
    const router = useRouter();

    const handleDeleteLecture = async () => {
        const result = await deleteLectureAction(String(id));

        if (!result.success) {
            toast.error(result.message ?? '강의 삭제에 실패했습니다.', {
                duration: 1000
            });
            return;
        }

        toast.success(result.message ?? '강의를 삭제했습니다.', {
            duration: 1000
        });
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
                <Button className="bg-red-400 cursor-pointer hover:bg-red-500 text-white font-semibold text-md py-6 px-6 rounded-md! absolute bottom-6 right-6">삭제하기</Button>
            )}
            title="강의를 삭제하시겠습니까?"
            description="삭제한 강의는 되돌릴 수 없습니다."
            onDelete={handleDeleteLecture}
        />

    );
}
