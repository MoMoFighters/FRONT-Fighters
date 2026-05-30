'use client'

import { Button } from "@/components/ui/button";
import TwoButtonModal from "@/features/modal/TwoButtonModal";
import { toast } from "sonner";
import { updateLectureStatusAction } from "../../action";
import { useRouter } from "next/navigation";

export default function RejectLectureBtn({ id }: { id: number }) {

    const router = useRouter();

    const handleRejectLecture = async () => {

        try {

            await updateLectureStatusAction(
                String(id),
                "HOLD"
            );

            toast.success('강의 승인 절차 처리 성공', {
                duration: 1000
            });

            router.push('/admin/lectures');

        } catch (error) {

            toast.error(
                error instanceof Error
                    ? error.message
                    : '상태 변경에 실패했습니다.'
            );
        }
    };

    return (
        <TwoButtonModal
            trigger={(
                <Button
                    className="bg-red-400 cursor-pointer hover:bg-red-500 text-white font-semibold text-md py-6 px-6 rounded-md!"
                >
                    승인 거절
                </Button>
            )}
            title="해당 강의의 승인을 거절하시겠습니까?"
            description={`승인을 거절하면 강사에게 안내 이메일이 \n 발송됩니다.`}
            onConfirm={handleRejectLecture}
        />


    );
}