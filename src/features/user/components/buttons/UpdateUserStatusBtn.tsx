'use client'

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TwoButtonModal from "@/features/modal/TwoButtonModal";
import { useState } from "react";
import { toast } from "sonner";
import { UserResponse } from "../../type";
import { updateTeacherStatusAction } from "../../action";

type ModalType =
    | 'approve'
    | 'reject'
    | 'ban'
    | 'black'
    | 'activate'
    | null;

export default function UpdateUserStatusBtn({ user }: { user: UserResponse }) {

    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    const [modalType, setModalType] = useState<ModalType>(null);

    const updateTeacherStatus = async (
        status: string
    ) => {

        try {

            setModalType(null);


            const result = await updateTeacherStatusAction(
                String(user.userId),
                status
            );

            toast.success(result.status === "ACTIVE" ? '강사 승인 완료!' : `강사 승인 거절. 사유 : ${result.reason}`);

        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message.split('|')[1]
                    : '회원 상태 변경 실패';

            toast.error(message);
        }
    };

    const modalConfig = (() => {

        switch (modalType) {

            case 'approve':
                return {
                    open: true,
                    title: '해당 강사를 승인하시겠습니까?',
                    description: '승인 후 해당 강사의 활동이 가능합니다.',
                    onConfirm: () => updateTeacherStatus('APPROVE'),
                };

            case 'reject':
                return {
                    open: true,
                    title: '강사 승인을 거절하시겠습니까?',
                    description: '강사 승인 요청이 거절됩니다.',
                    onConfirm: () => updateTeacherStatus('REJECT'),
                };

            case 'ban':
                return {
                    open: true,
                    title: '해당 회원을 일시 정지하시겠습니까?',
                    description: '회원이 일정 기간 서비스 이용이 제한됩니다.',
                };

            case 'black':
                return {
                    open: true,
                    title: '해당 회원을 영구 정지하시겠습니까?',
                    description: '해당 회원이 영구적으로 서비스 이용이 제한됩니다.',
                };

            case 'activate':
                return {
                    open: true,
                    title: '해당 회원을 다시 활성화하시겠습니까?',
                    description: '해당 회원의 상태가 정상 활동 상태로 변경됩니다.',
                };

            default:
                return null;
        }

    })();

    return (
        <div className="flex justify-center">

            {/* 정지 처리 -> 회원 status === "active" 공통 */}
            {user.status === "ACTIVE" && (
                <DropdownMenu
                    open={dropdownOpen}
                    onOpenChange={setDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className='
                            px-3
                            py-1.5
                            font-semibold
                            transition-colors
                            text-[14px]
                            cursor-pointer
                          bg-green-100 text-green-700 hover:bg-green-200'
                        >
                            {user.role === 'TEACHER' ? '승인' : '활동중'}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                        <DropdownMenuItem
                            className=" justify-center text-amber-700 focus:text-amber-700 focus:bg-amber-50"
                            onClick={() => {
                                setDropdownOpen(false);
                                setModalType('ban');
                            }}>
                            일시정지
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="justify-center text-red-700 focus:text-red-700 focus:bg-red-50"
                            onClick={() => {
                                setDropdownOpen(false);
                                setModalType('black');
                            }}>
                            영구정지
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

            {/* 승인 여부 처리 -> status === "pending" 이고, 강사일 경우 */}
            {user.status === 'PENDING' && user.role === "TEACHER" && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div>
                            <Button
                                className={`
                                px-3
                                py-1.5
                                font-semibold
                                transition-colors
                                text-[14px]
                                cursor-pointer
                                bg-amber-100 text-amber-700 hover:bg-amber-200
                            `}
                            >미승인
                            </Button>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem
                            className="justify-center text-emerald-700 focus:text-emerald-700 focus:bg-emerald-50"
                            onClick={() => {
                                setDropdownOpen(false);
                                setModalType('approve');
                            }}
                        >
                            강사 승인
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="justify-center text-red-700 focus:text-red-700 focus:bg-red-50"
                            onClick={() => {
                                setDropdownOpen(false);
                                setModalType('reject');
                            }}
                        >
                            승인 거절
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

            {/* 일시 정지된 유저 처리 -> status === "banned" 공통 */}
            {user.status === "BANNED" && (
                <DropdownMenu
                    open={dropdownOpen}
                    onOpenChange={setDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                        <div>
                            <Button
                                className={`
                                px-3
                                py-1.5
                                font-semibold
                                transition-colors
                                text-[14px]
                                cursor-pointer
                                bg-amber-100 text-amber-700 hover:bg-amber-200
                            `}
                            >일시정지
                            </Button>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem
                            className="justify-center text-emerald-700 focus:text-emerald-700 focus:bg-emerald-50"
                            onClick={() => {
                                setDropdownOpen(false);
                                setModalType('activate');
                            }}
                        >
                            정지해제
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="justify-center text-red-700 focus:text-red-700 focus:bg-red-50"
                            onClick={() => {
                                setDropdownOpen(false);
                                setModalType('black');
                            }}
                        >
                            영구정지
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

            {/* 영구 정지된 유저 정지 해제 -> status === "black" 공통 */}
            {user.status === 'BLACK' && (
                <Button
                    className="
                        px-3
                        py-1.5
                        font-semibold
                        transition-colors
                        text-[14px]
                        cursor-pointer
                        bg-red-100 text-red-700 hover:bg-red-200"
                    onClick={() => {
                        setModalType('activate');
                    }}
                >
                    영구정지
                </Button>
            )}

            <TwoButtonModal
                open={modalConfig?.open}
                onOpenChange={(open) => {

                    if (!open) {
                        setModalType(null);
                    }
                }}
                title={modalConfig?.title}
                description={modalConfig?.description}
                onConfirm={modalConfig?.onConfirm}
            />
        </div>
    );
}
