"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import FriendItem from "@/components/phone/friends/FriendItem";
import { MessageCirclePlus, UserPlus, X } from "lucide-react";
import { getStudentFriendListAction } from "@/features/friend/action";
import { createChatRoomAction } from "@/features/chat/action";
import { Button } from "@/components/ui/button";
import type { StudentFriendData } from "@/features/friend/type";

const DEFAULT_EMPTY_MESSAGE = "\uC544\uC9C1 \uCE5C\uAD6C\uAC00 \uC5C6\uC5B4\uC694.";
const ADD_FRIEND_LABEL = "\uCE5C\uAD6C \uCD94\uAC00";
const CLOSE_LABEL = "\uB2EB\uAE30";
const FRIEND_LIST_TITLE = "\uB0B4 \uCE5C\uAD6C \uBAA9\uB85D";
const ROOM_TITLE_PLACEHOLDER =
    "\uCC44\uD305\uBC29 \uC774\uB984\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.";
const SUBMIT_LABEL = "\uCC44\uD305 \uC2DC\uC791\uD558\uAE30";
const SUBMITTING_LABEL = "\uC0DD\uC131 \uC911";

export default function MyFriendListModal() {
    const router = useRouter();
    const [isModal, setIsModal] = useState(false);
    const [friendList, setFriendList] = useState<StudentFriendData[]>([]);
    const [message, setMessage] = useState(DEFAULT_EMPTY_MESSAGE);
    const [selectedFriendIds, setSelectedFriendIds] = useState<number[]>([]);
    const [roomTitle, setRoomTitle] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const canCreateGroupChat =
        selectedFriendIds.length >= 2 && roomTitle.trim().length > 0;

    useEffect(() => {
        if (!isModal) return;

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
    }, [isModal]);

    const closeModal = () => {
        setIsModal(false);
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

    if (!isModal) {
        return (
            <MessageCirclePlus
                className="h-12 w-12 cursor-pointer text-slate-500"
                onClick={() => setIsModal(true)}
            />
        );
    }

    return (
        <>
            <div className="pr-2 py-auto flex justify-center cursor-pointer">
                <UserPlus
                    className="h-5 w-5 text-slate-500"
                    aria-label={ADD_FRIEND_LABEL}
                />
            </div>

            <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={closeModal}
            >
                <div
                    className="bg-white px-7 pb-8 pt-3 w-[40vw] h-[40vw] rounded flex flex-col align-middle"
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="flex flex-row mt-2">
                        <div className="flex-1" />

                        <button
                            type="button"
                            onClick={closeModal}
                            aria-label={CLOSE_LABEL}
                            className="flex h-7 w-7 cursor-pointer items-center justify-center text-slate-700 hover:text-slate-950"
                        >
                            <X className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>

                    <div className="mt-2">
                        <p className="font-bold text-center text-xl mb-2 border-b border-slate-300 pb-2">
                            {FRIEND_LIST_TITLE}
                        </p>
                    </div>

                    <div className="overflow-y-scroll h-full scrollbar-none mt-2 gap-1 flex flex-col py-2">
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
                            className="border border-slate-400 flex-1 mr-2 p-2 disabled:bg-slate-100 disabled:text-slate-400"
                            placeholder={ROOM_TITLE_PLACEHOLDER}
                        />
                        <Button
                            type="button"
                            disabled={!canCreateGroupChat || isSubmitting}
                            onClick={handleCreateChatRoom}
                            className="cursor-pointer h-full disabled:bg-indigo-300 bg-indigo-500 hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? SUBMITTING_LABEL : SUBMIT_LABEL}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
