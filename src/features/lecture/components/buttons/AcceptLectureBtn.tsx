'use client'

import { Button } from "@/components/ui/button";
import TwoButtonModal from "@/features/modal/TwoButtonModal";
import { toast } from "sonner";

export default function AcceptLectureBtn() {

    const handleAcceptLecture = () => {

        try {

            console.log('강의 승인');

            // await updateUserStatusAction({
            //     lectureId: id,
            //     status: "ACTIVE",
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
                    className="bg-blue-400 cursor-pointer hover:bg-blue-500 text-white font-semibold text-md py-6 px-6 rounded-md!"
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