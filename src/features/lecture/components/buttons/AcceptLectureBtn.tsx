'use client'

import { Button } from "@/components/ui/button";
import TwoButtonModal from "@/features/modal/TwoButtonModal";
import { toast } from "sonner";
import { updateLectureStatusAction } from "../../action";
import { useRouter } from "next/navigation";

export default function AcceptLectureBtn({ id }: { id: number }) {

    const router = useRouter();

    const handleAcceptLecture = async () => {

        try {

            await updateLectureStatusAction(
                String(id),
                "ACTIVE"
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
                    className="bg-blue-400 cursor-pointer hover:bg-blue-500 text-white font-bold text-md py-6 px-6 rounded-md!"
                >
                    강의 승인
                </Button>
            )}
            title="해당 강의를 승인하시겠습니까?"
            description={`강의를 승인하면 \n 해당 강의가 공개 처리됩니다.`}
            onConfirm={handleAcceptLecture}
        />
    );
}