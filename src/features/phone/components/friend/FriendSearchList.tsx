'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import FriendItem from "@/components/phone/friends/FriendItem";
import { searchUserAction } from "@/features/friend/action";

interface FriendInfo {
    userId: number;
    nickname: string;
    status: "none" | "SENT" | "FRIEND" | "RECEIVED" | "BLOCK";
    role: "STUDENT" | "TEACHER";
    profileImageUrl: string;
    lectureTitle?: string;
}

export default function FriendSearchList() {
    const [users, setUsers] = useState<FriendInfo[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [message, setMessage] = useState("닉네임을 입력해 친구를 검색해보세요.");

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const response = await searchUserAction(searchValue);
        console.log(response, "?")

        if (response.status < 200 || response.status >= 300) {
            setUsers([]);
            setMessage(response.message);
            return;
        }

        const searchResult = response.data ?? [];

        const filteredResult: FriendInfo[] = searchResult
            .filter(user => user.role === "STUDENT")
            .map(user => ({
                userId: user.userId,
                nickname: user.nickname ?? "이름 없음",
                status: user.status,
                role: user.role,
                profileImageUrl: user.profileImageUrl ?? "",
                lectureTitle: user.lectureTitle,
            }));

        setUsers(filteredResult);
        setMessage(
            filteredResult.length === 0
                ? "검색 결과가 없습니다."
                : response.message
        );
    };

    return (
        <section className="flex min-h-0 flex-col bg-slate-50">
            <div className="border-b border-slate-200 bg-white px-5 py-3">
                <p className="font-bold text-slate-900">
                    요청하기
                </p>
            </div>

            <div className="flex min-h-0 flex-1 flex-col p-5">
                <form
                    onSubmit={handleSearch}
                    className="flex gap-2"
                >
                    <input
                        type="text"
                        className="h-10 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-500"
                        placeholder="닉네임을 입력하세요."
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                    />

                    <Button
                        type="submit"
                        disabled={!searchValue.trim()}
                        className="h-10 bg-indigo-500 px-4 text-white hover:bg-indigo-600"
                    >
                        검색
                    </Button>
                </form>

                <div className="mt-4 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto scrollbar-none">
                    {users.length > 0 ? (
                        users
                            .filter(user => user.status === "none")
                            .map(user => (
                                <FriendItem
                                    key={user.userId}
                                    friendInfo={{
                                        userId: user.userId,
                                        name: user.nickname,
                                        status: user.status,
                                        profile: user.profileImageUrl,
                                    }}
                                />
                            ))
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <p className="text-center font-medium text-slate-500">
                                {message}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}