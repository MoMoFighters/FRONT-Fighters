'use client'

import { Button } from "@/components/ui/button";
import DeleteModal from "@/features/modal/DeleteModal";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteLectureBtnProps {
    id: number;
    mode: 'icon' | 'text';
}

export default function DeleteLectureBtn({
    id,
    mode,
}: DeleteLectureBtnProps) {

    const handleDeleteLecture = async () => {

        try {

            console.log('삭제할 강의 id:', id);

            // await deleteLectureAction(id);

            toast.success('성공적으로 삭제되었습니다.', {
                duration: 1000
            });

        } catch {

            toast.error('강의 삭제에 실패했습니다.', {
                duration: 1000
            });
        }
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