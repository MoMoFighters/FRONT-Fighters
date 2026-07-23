'use client'

import busStaion from '@/app/assets/img/busStation.png'
import { Search, X } from 'lucide-react'
import Image from "next/image";
import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';

import { getStudentFriendListAction } from '@/features/friend/action';

import { Button } from '../ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { UserRole } from '@/features/user/type';

interface BusStationProps {
    mode: 'MY' | "FRIEND";
    currentOwnerId?: number;
    variant?: 'desktop' | 'mobile';
}

interface CityFriend {
    userId: number;
    nickname: string;
    role: UserRole;
    profileImageUrl?: string;
}

export default function BusStation({ mode, currentOwnerId, variant = 'desktop' }: BusStationProps) {

    const [isModal, setIsModal] = useState(false);
    const [searchedValue, setSearchedValue] = useState("");
    const [submittedKeyword, setSubmittedKeyword] = useState("");
    const [friends, setFriends] = useState<CityFriend[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!isModal) {
            return;
        }

        let ignore = false;

        const fetchFriends = async () => {
            setIsLoading(true);
            setErrorMessage("");

            const response = await getStudentFriendListAction();

            if (ignore) {
                return;
            }

            if (response.status === 200 && response.data) {
                setFriends(response.data);
            } else {
                setFriends([]);
                setErrorMessage(response.message || "친구 목록을 불러오지 못했습니다.");
            }

            setIsLoading(false);
        };

        fetchFriends();

        return () => {
            ignore = true;
        };
    }, [isModal]);

    const filteredFriends = useMemo(() => {
        const keyword = submittedKeyword.trim().toLowerCase();

        if (!keyword) {
            return friends;
        }

        return friends.filter((friend) =>
            friend.nickname.toLowerCase().includes(keyword)
        );
    }, [friends, submittedKeyword]);

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmittedKeyword(searchedValue);
    };

    return (
        <>
            {variant === 'mobile' ? (
                <button
                    type="button"
                    onClick={() => setIsModal(true)}
                    className="block w-full cursor-pointer border-0 bg-transparent p-0 text-left"
                >
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="font-black text-slate-900">
                            친구 도시로 이동하기
                        </p>
                        <p className="mt-1 text-xs font-medium text-slate-500">
                            {mode === 'MY'
                                ? "친구의 도시로 이동해보세요"
                                : "다른 친구의 도시로 이동하거나 내 도시로 돌아가보세요"}
                        </p>
                    </div>
                </button>
            ) : (
                <div className="absolute left-[22.5%] top-[18.5%] z-10 aspect-square w-[9.375%]">
                    <HoverCard
                        openDelay={50}
                        closeDelay={50}
                    >
                        <HoverCardTrigger asChild>
                            <button
                                type="button"
                                onClick={() => setIsModal(true)}
                                className="relative block h-full w-full cursor-pointer border-0 bg-transparent p-0"
                                style={{
                                    transform: "rotate(-8deg) skewX(-5deg) scaleY(0.92)",
                                    transformOrigin: "center",
                                }}
                            >
                                <BusStationVisual />
                            </button>
                        </HoverCardTrigger>
                        <HoverCardContent
                            side="bottom"
                            align="center"
                            sideOffset={8}
                        >
                            <div className="space-y-1 -top-20 z-40">
                                <p className="text-sm font-bold text-slate-900">
                                    버스정류장
                                </p>
                                <p className="text-xs font-medium text-slate-500">
                                    {mode === 'MY'
                                        ? "친구의 도시로 이동해보세요"
                                        : "다른 친구의 도시로 이동하거나 내 도시로 돌아가보세요"}
                                </p>
                            </div>
                        </HoverCardContent>
                    </HoverCard>

                    <span className="pointer-events-none absolute bottom-[15%] left-1/2 z-10 -translate-x-1/2 translate-y-1/2 whitespace-nowrap rounded-[0.3cqw] bg-white px-[0.4cqw] py-[0.08cqw] text-[0.75cqw] font-bold text-slate-700 shadow-sm">
                        버스정류장
                    </span>
                </div>
            )}


            {isModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm"
                    onClick={() => setIsModal(false)}
                >
                    <div
                        className="relative flex max-h-[78vh] w-[92vw] flex-col overflow-hidden rounded-3xl border border-white/80 bg-white/95 p-6 shadow-2xl shadow-slate-950/25 md:w-[60vw]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setIsModal(false)}
                            className="absolute right-5 top-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            aria-label="닫기"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="mb-5 flex items-start justify-between gap-3 pr-10">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">
                                    친구 도시로 이동하기
                                </h2>

                                <p className="mt-1 text-sm font-medium text-slate-400">
                                    방문할 친구를 검색하고 도시로 이동해보세요.
                                </p>
                            </div>

                            {mode === "FRIEND" && (
                                <Link
                                    href="/student"
                                    className="flex shrink-0 items-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-black text-indigo-500 transition hover:bg-indigo-100"
                                >
                                    내 도시로 돌아가기
                                </Link>
                            )}
                        </div>

                        <form
                            onSubmit={handleSearch}
                            className="mb-4 flex flex-row gap-2"
                        >
                            <input
                                type="text"
                                placeholder="친구 닉네임으로 검색해보세요"
                                value={searchedValue}
                                onChange={(e) => setSearchedValue(e.target.value)}
                                className="h-11 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                            />

                            <Button
                                type="submit"
                                className="h-11 rounded-2xl bg-indigo-500 px-4 font-black text-white hover:bg-indigo-600"
                            >
                                <Search className="h-4 w-4" />
                                검색
                            </Button>
                        </form>

                        <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50/80 p-3 scrollbar-hidden">
                            {isLoading ? (
                                <div className="flex h-36 items-center justify-center text-sm font-bold text-slate-400">
                                    친구 목록을 불러오는 중입니다.
                                </div>
                            ) : errorMessage ? (
                                <div className="flex h-36 items-center justify-center text-sm font-bold text-rose-400">
                                    {errorMessage}
                                </div>
                            ) : filteredFriends.length === 0 ? (
                                <div className="flex h-36 items-center justify-center text-sm font-bold text-slate-400">
                                    검색 결과가 없습니다.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                    {filteredFriends.map((friend) => {
                                        const isCurrentCity = friend.userId === currentOwnerId;

                                        if (isCurrentCity) {
                                            return (
                                                <div
                                                    key={friend.userId}
                                                    className="flex h-20 w-full items-center gap-3 rounded-2xl border border-indigo-200 bg-indigo-50 p-3 text-left"
                                                >
                                                    <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-sm font-black text-indigo-500">
                                                        {friend.profileImageUrl ? (
                                                            <img
                                                                src={friend.profileImageUrl}
                                                                alt={`${friend.nickname} 프로필`}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            friend.nickname.slice(0, 1)
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-black text-slate-800">
                                                            {friend.nickname}
                                                        </p>
                                                        <p className="mt-0.5 text-xs font-bold text-indigo-500">
                                                            현재 위치한 도시
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <Link
                                                key={friend.userId}
                                                href={`/student/users/${friend.userId}`}
                                                className="flex h-20 w-full cursor-pointer items-center gap-3 rounded-2xl border border-indigo-100 bg-white p-3 text-left shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/60"
                                            >
                                                <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-sm font-black text-indigo-500">
                                                    {friend.profileImageUrl ? (
                                                        <img
                                                            src={friend.profileImageUrl}
                                                            alt={`${friend.nickname} 프로필`}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        friend.nickname.slice(0, 1)
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-black text-slate-800">
                                                        {friend.nickname}
                                                    </p>
                                                    <p className="mt-0.5 text-xs font-bold text-slate-400">
                                                        친구 도시로 이동하기
                                                    </p>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function BusStationVisual() {
    return (
        <div
            className="relative h-full w-full transition-transform duration-200 hover:scale-110"
        >
            <Image
                src={busStaion}
                alt="버스정류장"
                fill
                quality={80}
                sizes="10vw"
            />
        </div>
    );
}
