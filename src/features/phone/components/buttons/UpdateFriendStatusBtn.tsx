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
                    className="h-9 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow-sm"
                    onClick={() => handleAction(sendFriendRequestAction)}
                >
                    친구추가
                </Button>
            )}

            {status === 'SENT' && (
                <Button
                    className="h-9 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                    onClick={() => handleAction(cancelFriendRequestAction)}
                >
                    요청취소
                </Button>
            )}

            {status === 'RECEIVED' && (
                <>
                    <Button
                        className="h-9 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow-sm"
                        onClick={() => handleAction(acceptFriendRequestAction)}
                    >
                        수락
                    </Button>

                    <Button
                        className="h-9 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                        onClick={() => handleAction(rejectFriendRequestAction)}
                    >
                        거절
                    </Button>
                </>
            )}

            {status === 'FRIEND' && (
                <div className="flex gap-2">
                    <Button
                        className="h-9 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow-sm"
                        onClick={handleCreateChatRoom}
                    >
                        채팅하기
                    </Button>

                    <DropdownMenu
                        open={dropdownOpen}
                        onOpenChange={setDropdownOpen}
                    >
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-9 px-4 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg"
                            >
                                관리
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="center"
                            className="rounded-xl border-slate-200"
                        >
                            <DropdownMenuItem
                                className="justify-center text-amber-600 focus:text-amber-600 focus:bg-amber-50"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    setModalType('BLOCK');
                                }}
                            >
                                차단하기
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                className="justify-center text-red-600 focus:text-red-600 focus:bg-red-50"
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
                    className="h-9 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                    onClick={() => handleAction(unblockFriendAction)}
                >
                    차단해제
                </Button>
            )}
        </div>
    );
}