'use client'

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    sendFriendRequestAction,
    cancelFriendRequestAction,
    acceptFriendRequestAction,
    rejectFriendRequestAction,
    blockFriendAction,
    unblockFriendAction,
    createChatRoomAction,
    deleteFriendAction,
} from "../../chatAction";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import TwoButtonModal from "@/features/modal/TwoButtonModal";
import { useRouter } from "next/navigation";

interface Props {
    data: {
        userId: number;
        status: 'none' | 'SENT' | 'FRIEND' | 'RECEIVED' | 'BLOCK';
    };
}

export default function UpdateFriendStatusBtn({ data }: Props) {
    const { status, userId } = data;
    const router = useRouter();

    const handleAction = async (actionFn: (userId: number) => Promise<any>) => {
        const result = await actionFn(userId);
        if (!result.success) {
            toast.error(result.message, { duration: 2000 });
            return;
        }
        toast.success(result.message, { duration: 2000 });
    };
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [modalType, setModalType] = useState<'BLOCK' | 'DELETE' | null>(null);
    const handleCreateChatRoom = async () => {
        const response = await createChatRoomAction(userId);

        if (response.status !== 200 && response.status !== 201) {
            toast.error(response.message, {
                duration: 1000
            });
            return;
        }
        toast(response.message, {
            duration: 1000
        })

        router.push(
            `/student/phone/friends?status=friend&roomId=${response.data?.roomId}`
        );
        // router.refresh()
    };

    const modalConfig = (() => {
        switch (modalType) {
            case 'BLOCK':
                return {
                    open: true,
                    title: '해당 친구를 차단하시겠습니까?',
                    description: '차단 시 더 이상 친구 목록에서 보이지 않습니다.',
                    onConfirm: async () => {
                        const response = await blockFriendAction(userId)
                        if (!response.success) {
                            toast.error(response.message)
                            return
                        }
                        toast(response.message)
                    },
                };

            case 'DELETE':
                return {
                    open: true,
                    title: '해당 친구를 삭제하시겠습니까?',
                    description: '친구 관계가 해제됩니다.',
                    onConfirm: async () => {
                        const response = await deleteFriendAction(userId)
                        if (!response.success) {
                            toast.error(response.message)
                            return
                        }
                        toast(response.message)
                    },
                };

            default:
                return null;
        }
    })();

    return (
        <div className="flex flex-row gap-2 items-center">
            {status === 'none' && (
                <Button
                    className="bg-slate-200 text-slate-900"
                    onClick={() => handleAction(sendFriendRequestAction)}
                >
                    요청
                </Button>
            )}
            {status === 'SENT' && (
                <Button
                    className="bg-slate-200 text-slate-900"
                    onClick={() => handleAction(cancelFriendRequestAction)}
                >
                    취소
                </Button>
            )}
            {status === 'RECEIVED' && (
                <>
                    <Button
                        className="bg-sky-500 text-white"
                        onClick={() => handleAction(acceptFriendRequestAction)}
                    >
                        수락
                    </Button>
                    <Button
                        className="bg-slate-200 text-slate-900"
                        onClick={() => handleAction(rejectFriendRequestAction)}
                    >
                        거절
                    </Button>
                </>
            )}
            {status === 'FRIEND' && (
                <div className="flex gap-2">
                    <Button
                        className="bg-blue-100 text-blue-600"
                        onClick={handleCreateChatRoom}
                    >
                        채팅하기
                    </Button>

                    <DropdownMenu
                        open={dropdownOpen}
                        onOpenChange={setDropdownOpen}
                    >
                        <DropdownMenuTrigger asChild>
                            <Button className="bg-red-100 text-red-500">
                                관리
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="center">
                            <DropdownMenuItem
                                className="justify-center text-red-700 focus:text-red-700 focus:bg-red-50"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    setModalType('BLOCK');
                                }}
                            >
                                차단하기
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                className="justify-center text-red-700 focus:text-red-700 focus:bg-red-50"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    setModalType('DELETE');
                                }}
                            >
                                친구삭제
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

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
            )}
            {status === 'BLOCK' && (
                <Button
                    className="bg-slate-200 text-slate-900"
                    onClick={() => handleAction(unblockFriendAction)}
                >
                    차단해제
                </Button>
            )}
        </div>
    );
}