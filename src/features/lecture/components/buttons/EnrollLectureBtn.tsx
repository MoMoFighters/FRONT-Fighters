'use client'

import { Button } from "@/components/ui/button";
import TwoButtonModal from "@/features/modal/TwoButtonModal";
import { toast } from "sonner";

export default function EnrollLectureBtn() {

    const handleEnrollLecture = () => {

        try {

            console.log('수강 신청');

            // await updateUserStatusAction({
            //     lectureId: id,
            //     status: "ACTIVE",
            // });

            toast.success('성공적으로 수강 신청 되었습니다!', {
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
                    className="bg-blue-400 cursor-pointer hover:bg-blue-500 text-white font-semibold text-md py-6 px-6 rounded-md! absolute bottom-6 right-6">
                    수강 신청
                </Button>
            )}
            title="해당 강의의 수강을 신청하시겠습니까?"
            description={`수강 신청한 강의는 내 강의 탭에서 \n 확인 가능합니다.`}
            onConfirm={handleEnrollLecture}
        />

    );
}