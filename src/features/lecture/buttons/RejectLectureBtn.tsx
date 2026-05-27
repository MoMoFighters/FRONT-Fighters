'use client'

import { Button } from "@/components/ui/button";
import TwoButtonModal from "@/features/common/TwoButtonModal";
import { toast } from "sonner";

export default function RejectLectureBtn() {

    const handleRejectLecture = () => {

        try {

            console.log('승인 거절');

            // await updateUserStatusAction({
            //     lectureId: id,
            //     status: "HOLD",
            // });

            toast.success('강의 승인 절차 처리 성공', {
                duration: 1000
            });
        } catch {
            // error 메시지 잡아오기
            toast.error('');
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