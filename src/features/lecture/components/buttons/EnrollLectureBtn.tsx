'use client'

import { Button } from "@/components/ui/button";
import TwoButtonModal from "@/features/modal/TwoButtonModal";
import { toast } from "sonner";
import { enrollLectureAction } from "../../action";
import { useRouter } from "next/navigation";

export default function EnrollLectureBtn({ lectureId }: { lectureId: number }) {

    const router = useRouter();

    const handleEnrollLecture = async () => {

        try {
            const result = await enrollLectureAction(String(lectureId));

            router.refresh();

            toast.success('성공적으로 수강 신청 되었습니다!', {
                duration: 1000
            });
        } catch (error) {

            if (!(error instanceof Error)) {
                toast.error('알 수 없는 오류가 발생했습니다.');
                return;
            }

            const [status, message] =
                error.message.split('|');

            if (status === '409') {
                toast.error(
                    message || '이미 수강 신청한 강의입니다.'
                );
                return;
            }

            toast.error(message);
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