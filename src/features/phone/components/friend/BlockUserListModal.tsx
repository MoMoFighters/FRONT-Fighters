'use client'

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import FriendItem from "@/components/phone/friends/FriendItem";
import { getFriendListAction } from "@/features/friend/action";

interface friendInfo {
    userId: number;
    name?: string;
    nickname: string;
    status: 'none' | 'SENT' | 'FRIEND' | 'RECEIVED' | 'BLOCK';
    role: 'STUDENT' | 'TEACHER';
    profileImageUrl?: string;
    lectureTitle?: string;
}

export default function BlockUserListModal({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (v: boolean) => void;
}) {
    const [friendList, setFriendList] = useState<friendInfo[]>([]);
    const [message, setMessage] = useState('차단된 친구가 없어요');

    useEffect(() => {
        if (!open) return;

        const getFriends = async () => {
            const response = await getFriendListAction("BLOCKED");

            setMessage(response.message);

            if (response.status >= 200 && response.status < 300) {
                setFriendList(response.data ?? []);
            } else {
                setFriendList([]);
            }
        };

        getFriends();
    }, [open]);

    if (!open) return null;

    return (
        <>


            <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={() => setOpen(false)}
            >
                <div
                    className="bg-white px-7 pb-8 pt-3 w-[40vw] h-[40vw] rounded flex flex-col align-middle"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-row mt-2">
                        <div className="flex-1"></div>

                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="닫기"
                            className="flex h-7 w-7 cursor-pointer items-center justify-center text-slate-700 hover:text-slate-950"
                        >
                            <X className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>

                    <div className="mt-2">
                        <p className="font-bold text-center text-xl mb-2">
                            차단 유저 목록
                        </p>
                    </div>

                    <div className="overflow-y-scroll h-full scrollbar-none mt-2 gap-1">
                        {friendList.length !== 0 ? (
                            friendList
                                .filter(friend => friend.status === 'BLOCK')
                                .map(friend => (
                                    <FriendItem
                                        key={friend.userId}
                                        friendInfo={{
                                            status: friend.status,
                                            name: friend.name ?? friend.nickname,
                                            profile: friend.profileImageUrl ?? '',
                                            userId: friend.userId,
                                        }}
                                    />
                                ))
                        ) : (
                            <div className="flex justify-center align-middle h-full">
                                <p className="my-auto py-auto font-bold text-xl text-slate-900">
                                    {message}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
