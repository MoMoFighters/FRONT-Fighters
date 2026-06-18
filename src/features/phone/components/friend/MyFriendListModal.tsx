'use client'

import { useEffect, useState } from "react";
import FriendItem from "@/components/phone/friends/FriendItem";
import { MessageCirclePlus, UserPlus, X } from "lucide-react";
import { getFriendListAction } from "@/features/friend/action";
import { Button } from "@/components/ui/button";

interface friendInfo {
    userId: number;
    name?: string;
    nickname: string;
    status: 'none' | 'SENT' | 'FRIEND' | 'RECEIVED' | 'BLOCK';
    role: 'STUDENT' | 'TEACHER';
    profileImageUrl?: string;
    lectureTitle?: string;
}

export default function MyFriendListModal() {
    const [isModal, setIsModal] = useState(false);
    const [friendList, setFriendList] = useState<friendInfo[]>([]);
    const [message, setMessage] = useState('아직 친구가 없어요');

    useEffect(() => {
        if (!isModal) return;

        const getFriends = async () => {
            const response = await getFriendListAction("FRIEND");

            setMessage(response.message);

            if (response.status === 200) {
                setFriendList(response.data ?? []);
            } else {
                setFriendList([]);
            }
        };

        getFriends();
    }, [isModal]);

    if (!isModal) {
        return (
            <MessageCirclePlus
                className="h-12 w-12 cursor-pointer"
                onClick={() => setIsModal(true)}
            />
        );
    }

    return (
        <>
            <div
                className="pr-2 py-auto flex justify-center cursor-pointer"
            >
                <UserPlus className="h-5 w-5 text-slate-700" aria-label="친구 추가" />
            </div>

            <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={() => setIsModal(false)}
            >
                <div
                    className="bg-white px-7 pb-8 pt-3 w-[40vw] h-[40vw] rounded flex flex-col align-middle"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-row mt-2">
                        <div className="flex-1"></div>

                        <button
                            type="button"
                            onClick={() => setIsModal(false)}
                            aria-label="닫기"
                            className="flex h-7 w-7 cursor-pointer items-center justify-center text-slate-700 hover:text-slate-950"
                        >
                            <X className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>

                    <div className="mt-2">
                        <p className="font-bold text-center text-xl mb-2 border-b border-slate-300 pb-2">
                            내 친구 목록
                        </p>
                    </div>

                    <div className="overflow-y-scroll h-full scrollbar-none mt-2 gap-1 flex flex-col py-2">
                        {friendList.length !== 0 ? (
                            friendList
                                .filter(friend => friend.status === 'FRIEND')
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
                    <div className="flex items-center justify-center mt-2 border-t border-slate-300 pt-2">
                        <Button>
                            채팅 시작하기
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
