'use client'

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import TwoButtonModal from "@/features/modal/TwoButtonModal";
import { enrollLectureAction } from "../../action";

interface EnrollLectureBtnProps {
    lectureId: number;
    position?: string;
    className?: string;
}

export default function EnrollLectureBtn({
    lectureId,
    position,
    className,
}: EnrollLectureBtnProps) {
    const router = useRouter();

    const handleEnrollLecture = async () => {
        try {
            await enrollLectureAction(String(lectureId), position ?? "");
            router.refresh();

            toast.success("정상적으로 수강 신청 되었습니다.", {
                duration: 1000,
            });
        } catch (error) {
            if (!(error instanceof Error)) {
                toast.error("알 수 없는 오류가 발생했습니다.");
                return;
            }

            const [status, message] = error.message.split("|");

            if (status === "409") {
                toast.error(message || "이미 수강 신청한 강의입니다.");
                return;
            }

            toast.error(message);
        }
    };

    return (
        <TwoButtonModal
            trigger={(
                <Button
                    className={className ?? "absolute right-6 bottom-6 cursor-pointer rounded-md! bg-blue-400 px-6 py-6 text-md font-semibold text-white hover:bg-blue-500"}
                >
                    수강 신청
                </Button>
            )}
            title="해당 강의를 수강 신청하시겠습니까?"
            description={`수강 신청한 강의는 내 강의 목록에서\n 확인 가능합니다.`}
            onConfirm={handleEnrollLecture}
        />
    );
}
