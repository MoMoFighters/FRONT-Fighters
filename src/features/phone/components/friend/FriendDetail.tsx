'use client'

import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal, MessageCircle, Map, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import TwoButtonModal from "@/features/modal/TwoButtonModal";
import { FriendData } from "@/app/services/phone/chat/service";
import {
    blockFriendAction,
    createChatRoomAction,
    deleteFriendAction,
} from "../../../chat/action";
import { useState } from "react";

interface FriendDetailProps {
    friend: FriendData | null;
}

export default function FriendDetail({ friend }: FriendDetailProps) {
    const router = useRouter();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [modalType, setModalType] = useState<"BLOCK" | "DELETE" | null>(null);

    if (!friend) {
        return (
            <section className="flex h-full items-center justify-center bg-slate-50">
                <p className="font-medium text-slate-500">
                    친구를 선택하면 상세 정보가 표시됩니다.
                </p>
            </section>
        );
    }

    const displayName = friend.name ?? friend.nickname;

    const handleCreateChatRoom = async () => {
        const response = await createChatRoomAction(friend.userId);

        if (response.status !== 200 && response.status !== 201) {
            toast.error(response.message, {
                duration: 1000,
            });
            return;
        }

        toast(response.message, {
            duration: 1000,
        });

        router.push(
            `/student/phone/friends?status=chat&roomId=${response.data?.roomId}`
        );
    };

    const modalConfig = (() => {
        switch (modalType) {
            case "BLOCK":
                return {
                    open: true,
                    title: "해당 친구를 차단하시겠습니까?",
                    description: "차단 후에는 친구 목록에서 보이지 않습니다.",
                    onConfirm: async () => {
                        const response = await blockFriendAction(friend.userId);

                        if (!response.success) {
                            toast.error(response.message);
                            return;
                        }

                        toast(response.message);
                        setModalType(null);
                        router.push("/student/phone/friends?status=friend");
                        router.refresh();
                    },
                };

            case "DELETE":
                return {
                    open: true,
                    title: "해당 친구를 삭제하시겠습니까?",
                    description: "친구 관계가 해제됩니다.",
                    onConfirm: async () => {
                        const response = await deleteFriendAction(friend.userId);

                        if (!response.success) {
                            toast.error(response.message);
                            return;
                        }

                        toast(response.message);
                        setModalType(null);
                        router.push("/student/phone/friends?status=friend");
                        router.refresh();
                    },
                };

            default:
                return null;
        }
    })();

    return (
        <section className="relative flex h-full flex-col bg-slate-50">
            <div className="flex items-center justify-between px-5 py-3">
                {friend.role === 'STUDENT' ? (
                    <Button
                        asChild
                        variant="outline"
                        className="h-9 gap-2 rounded-lg border-slate-200 bg-white px-3 text-slate-700 hover:bg-slate-50"
                    >
                        <Link href={`/student/users/${friend.userId}`}>
                            <Map className="h-4 w-4" />
                            놀러가기
                        </Link>
                    </Button>
                ) : <div></div>}
                <Button
                    asChild
                    variant="ghost"
                    className="h-9 w-9 rounded-lg p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                >
                    <Link href="/student/phone/friends?status=friend">
                        <X className="h-5 w-5" />
                    </Link>
                </Button>

            </div>

            <div className="flex flex-1 flex-col items-center justify-center px-8">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-indigo-50 shadow-sm">
                    {friend.profileImageUrl ? (
                        <Image
                            src={friend.profileImageUrl}
                            alt="프로필"
                            width={112}
                            height={112}
                            className="h-28 w-28 object-cover"
                        />
                    ) : (
                        <p className="text-4xl font-bold text-indigo-600">
                            {displayName[0]}
                        </p>
                    )}
                </div>

                <p className="mt-5 max-w-full truncate text-2xl font-bold text-slate-900">
                    {displayName}
                </p>

                {friend.role === "TEACHER" ? (
                    <p className="mt-1 max-w-full truncate text-sm font-medium text-slate-500 h-6">
                        {friend.lectureTitle ?? "강사"}
                    </p>
                ) : <div className="mt-1 max-w-full truncate h-6">

                </div>}

                <div className="mt-8 flex items-center gap-3">
                    <Button
                        className="h-11 gap-2 rounded-xl bg-mauve-500 px-5 text-white hover:bg-mauve-600"
                        onClick={handleCreateChatRoom}
                    >
                        <MessageCircle className="h-5 w-5" />
                        채팅하기
                    </Button>

                    <DropdownMenu
                        open={dropdownOpen}
                        onOpenChange={setDropdownOpen}
                    >
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-11 w-11 rounded-xl border-slate-200 bg-white p-0 text-slate-700 hover:bg-slate-50"
                            >
                                <MoreHorizontal className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="center"
                            className="rounded-xl border-slate-200"
                        >
                            <DropdownMenuItem
                                className="justify-center text-amber-600 focus:bg-amber-50 focus:text-amber-600"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    setModalType("BLOCK");
                                }}
                            >
                                차단하기
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                className="justify-center text-red-600 focus:bg-red-50 focus:text-red-600"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    setModalType("DELETE");
                                }}
                            >
                                친구삭제
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

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
        </section>
    );
}