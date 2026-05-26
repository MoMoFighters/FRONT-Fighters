'use client'

import { useState } from "react";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import TwoButtonModal from "@/features/common/TwoButtonModal";
import { toast } from "sonner";

type ModalType =
    | 'accept'
    | 'reject'
    | null;

export default function UpdateLectureStatusBtn({
    status
}: {
    status: string
}) {

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [modalType, setModalType] =
        useState<ModalType>(null);

    let error;

    const handleAcceptLecture = () => {

        try {
            setModalType(null);

            console.log('강의 승인');

            // api 요청 액션 함수 호출

            toast.success('승인 성공');
        } catch {
            // error 메시지 잡아오기
            toast.error('');
        }
    };

    const handleRejectLecture = () => {

        try {
            setModalType(null);

            console.log('강의 승인');

            // api 요청 액션 함수 호출

            toast.success('거절 성공');
        } catch {
            // error 메시지 잡아오기
            toast.error('');
        }
    };

    if (status === 'active') {
        return (
            <span
                className="
                    px-3 py-1.5 rounded-lg
                    font-semibold text-sm
                    bg-emerald-100 text-emerald-700
                "
            >
                진행중
            </span>
        );
    }

    return (
        <>
            <DropdownMenu
                open={dropdownOpen}
                onOpenChange={setDropdownOpen}
            >

                <DropdownMenuTrigger asChild>

                    <Button
                        className="
                            px-3 py-1.5 rounded-lg
                            font-semibold text-sm
                            bg-amber-100 text-amber-700
                            hover:bg-amber-200
                            cursor-pointer
                        "
                    >
                        승인 대기
                    </Button>

                </DropdownMenuTrigger>

                <DropdownMenuContent align="center">

                    <DropdownMenuItem
                        className="
                            justify-center
                            text-emerald-700
                            focus:text-emerald-700
                            focus:bg-emerald-50
                            mb-1
                        "
                        onClick={() => {

                            setDropdownOpen(false);

                            setModalType('accept');
                        }}
                    >
                        강의 승인
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="
                            justify-center
                            text-red-700
                            focus:text-red-700
                            focus:bg-red-50
                        "
                        onClick={() => {

                            setDropdownOpen(false);

                            setModalType('reject');
                        }}
                    >
                        승인 거절
                    </DropdownMenuItem>

                </DropdownMenuContent>

            </DropdownMenu>

            <TwoButtonModal
                open={modalType === 'accept'}
                onOpenChange={(open) => {

                    if (!open) {
                        setModalType(null);
                    }
                }}
                title="해당 강의를 승인하시겠습니까?"
                description="강의가 승인되면 해당 강의가 공개 처리 됩니다."
                onConfirm={handleAcceptLecture}
            />

            <TwoButtonModal
                open={modalType === 'reject'}
                onOpenChange={(open) => {

                    if (!open) {
                        setModalType(null);
                    }
                }}
                title="강의의 승인을 거절하시겠습니까?"
                description={`승인을 거절하면 강사에게 안내 이메일이 \n 발송됩니다.`}
                onConfirm={handleRejectLecture}
            />
        </>
    );
}