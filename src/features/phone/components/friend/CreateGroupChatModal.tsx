"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import FriendItem from "@/components/phone/friends/FriendItem";
import { X } from "lucide-react";
import { getStudentFriendListAction } from "@/features/friend/action";
import { createChatRoomAction } from "@/features/chat/action";
import { Button } from "@/components/ui/button";
import type { StudentFriendData } from "@/features/friend/type";

const DEFAULT_EMPTY_MESSAGE = "아직 친구가 없어요.";
const CLOSE_LABEL = "닫기";
const FRIEND_LIST_TITLE = "내 친구 목록";
const ROOM_TITLE_PLACEHOLDER = "채팅방 이름을 입력해주세요.";
const SUBMIT_LABEL = "채팅 시작하기";
const SUBMITTING_LABEL = "생성 중";

interface CreateGroupChatModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// 단체 채팅 개설 모달 본체. PC 빈 채팅방 화면(MyFriendListModal)과
// 모바일 채팅목록 검색바 옆 + 버튼(ChatRoomListPanel) 둘 다 이 컴포넌트를 그대로 재사용한다.
export default function CreateGroupChatModal({
    open,
    onOpenChange,
}: CreateGroupChatModalProps) {
    const router = useRouter();
    const [friendList, setFriendList] = useState<StudentFriendData[]>([]);
    const [message, setMessage] = useState(DEFAULT_EMPTY_MESSAGE);
    const [selectedFriendIds, setSelectedFriendIds] = useState<number[]>([]);
    const [roomTitle, setRoomTitle] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const canCreateGroupChat =
        selectedFriendIds.length >= 2 && roomTitle.trim().length > 0;

    useEffect(() => {
        if (!open) return;

        const getFriends = async () => {
            const response = await getStudentFriendListAction();

            setMessage(response.message);

            if (response.status === 200) {
                setFriendList(response.data ?? []);
            } else {
                setFriendList([]);
            }
        };

        void getFriends();
    }, [open]);

    const closeModal = () => {
        onOpenChange(false);
        setSelectedFriendIds([]);
        setRoomTitle("");
        setIsSubmitting(false);
    };

    const toggleFriend = (userId: number) => {
        setSelectedFriendIds((prev) =>
            prev.includes(userId)
                ? prev.filter((selectedId) => selectedId !== userId)
                : [...prev, userId]
        );
    };

    const handleCreateChatRoom = async () => {
        if (!canCreateGroupChat || isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await createChatRoomAction({
                chatMember: selectedFriendIds,
                roomTitle: roomTitle.trim(),
            });

            if (response.status !== 200 && response.status !== 201) {
                toast.error(response.message, { duration: 1000 });
                return;
            }

            const roomId = response.data?.roomId;

            if (!roomId) {
                toast.error(response.message, { duration: 1000 });
                return;
            }

            toast.success(response.message, { duration: 1000 });
            closeModal();
            router.push(`/student/friends?status=chat&roomId=${roomId}`);
            router.refresh();
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={closeModal}
        >
            <div
                className="w-[92vw] max-w-sm h-[80vh] sm:w-[70vw] sm:max-w-md sm:h-[70vh] lg:w-[420px] lg:h-[560px] rounded-xl border border-slate-200 bg-white px-7 pb-8 pt-3 shadow-2xl flex flex-col align-middle"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex flex-row mt-2">
                    <div className="flex-1" />

                    <button
                        type="button"
                        onClick={closeModal}
                        aria-label={CLOSE_LABEL}
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="mt-2">
                    <p className="font-bold text-center text-lg mb-2 border-b border-slate-300 pb-2 text-slate-900">
                        {FRIEND_LIST_TITLE}
                    </p>
                </div>

                <div className="min-h-0 flex-1 overflow-y-scroll scrollbar-none mt-2 gap-1 flex flex-col py-2">
                    {friendList.length !== 0 ? (
                        friendList.map((friend) => {
                            const isSelected = selectedFriendIds.includes(friend.userId);

                            return (
                                <div
                                    key={friend.userId}
                                    className="grid grid-cols-[40px_1fr] items-center cursor-pointer"
                                    onClick={() => toggleFriend(friend.userId)}
                                >
                                    <div
                                        className={`w-4 h-4 border border-black ${isSelected ? "bg-indigo-500" : "bg-white"}`}
                                    />
                                    <FriendItem
                                        friendInfo={{
                                            status: friend.status,
                                            name: friend.nickname,
                                            profile: friend.profileImageUrl ?? "",
                                            userId: friend.userId,
                                        }}
                                        showActions={false}
                                        selected={isSelected}
                                    />
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex justify-center align-middle h-full">
                            <p className="my-auto py-auto font-bold text-xl text-slate-900">
                                {message}
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-center mt-2 border-t border-slate-300 pt-2">
                    <input
                        type="text"
                        value={roomTitle}
                        onChange={(event) => setRoomTitle(event.target.value)}
                        disabled={selectedFriendIds.length < 2 || isSubmitting}
                        className="h-10 flex-1 mr-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-100 disabled:text-slate-400"
                        placeholder={ROOM_TITLE_PLACEHOLDER}
                    />
                    <Button
                        type="button"
                        disabled={!canCreateGroupChat || isSubmitting}
                        onClick={handleCreateChatRoom}
                        className="cursor-pointer h-10 rounded-lg disabled:bg-indigo-300 bg-indigo-500 hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? SUBMITTING_LABEL : SUBMIT_LABEL}
                    </Button>
                </div>
            </div>
        </div>
    );
}
