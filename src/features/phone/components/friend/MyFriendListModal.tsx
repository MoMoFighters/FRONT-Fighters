'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import close from '@/app/assets/img/close.svg';
import search from "@/app/assets/img/user-plus.svg";
import FriendItem from "@/components/phone/friends/FriendItem";
import { MessageCirclePlus } from "lucide-react";
import { getFriendsAction } from "../../chatAction";

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
            const response = await getFriendsAction();

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
                <Image
                    src={search}
                    alt='친구추가'
                    className="w-5 h-5"
                />
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

                        <Image
                            src={close}
                            onClick={() => setIsModal(false)}
                            alt='닫기'
                            className="w-7 h-7 cursor-pointer"
                        />
                    </div>

                    <div className="mt-2">
                        <p className="font-bold text-center text-xl mb-2">
                            내 친구 목록
                        </p>
                    </div>

                    <div className="overflow-y-scroll h-full scrollbar-none mt-2 gap-1">
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
                </div>
            </div>
        </>
    );
}