"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import FriendItem from "@/components/phone/friends/FriendItem";
import type { FriendData } from "@/app/services/phone/friend/service";

interface FriendListProps {
    friends: FriendData[];
    selectedFriendId: number | null;
}

export default function FriendList({
    friends,
    selectedFriendId,
}: FriendListProps) {
    const [keyword, setKeyword] = useState("");

    const friendList = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();
        const onlyFriends = friends.filter(friend => friend.status === "FRIEND");

        if (!normalizedKeyword) {
            return onlyFriends;
        }

        return onlyFriends.filter((friend) => {
            const nickname = friend.nickname?.toLowerCase() ?? "";
            const name = friend.name?.toLowerCase() ?? "";

            return (
                nickname.includes(normalizedKeyword) ||
                name.includes(normalizedKeyword)
            );
        });
    }, [friends, keyword]);

    return (
        <section className="flex min-h-0 flex-col bg-white">
            <div className="space-y-3 bg-white px-5 pb-2 pt-4">
                <p className="font-semibold text-slate-900">
                    친구 목록
                </p>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="search"
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        placeholder="친구 이름 검색"
                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-5 scrollbar-none">
                {friendList.length > 0 ? (
                    friendList.map(friend => (
                        <FriendItem
                            key={friend.userId}
                            href={`/student/friends?status=friend&friendId=${friend.userId}`}
                            selected={selectedFriendId === friend.userId}
                            showActions={false}
                            friendInfo={{
                                userId: friend.userId,
                                name: friend.name ?? friend.nickname,
                                status: friend.status,
                                profile: friend.profileImageUrl ?? "",
                            }}
                        />
                    ))
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <p className="font-medium text-slate-500">
                            {keyword.trim() ? "검색 결과가 없습니다." : "친구가 없습니다."}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
