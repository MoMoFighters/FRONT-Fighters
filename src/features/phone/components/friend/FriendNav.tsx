'use client'
import Link from "next/link";
import SearchFriendModal from "./SearchFriendModal";
import { useState } from "react";

interface FriendNavProps {
    status: 'friend' | 'request'
}

export default function FriendNav({ status }: FriendNavProps) {

    const [navFriendSelected, setNavFriendSelected] =
        useState(status === "friend");

    const handleMyFriendClick = () => {
        setNavFriendSelected(true);
    };

    const handleRequestClick = () => {
        setNavFriendSelected(false);
    };

    return (
        <div className="w-full flex items-center px-3 py-2 border-b border-slate-200 bg-white">
            <div className="flex items-center p-1 rounded-full bg-slate-100">
                <Link href="/student/phone/friends?status=friends">
                    <div
                        onClick={handleMyFriendClick}
                        className={`
                        px-4 py-1.5 rounded-full cursor-pointer transition-all
                        ${navFriendSelected
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500"
                            }
                    `}
                    >
                        <p className="text-sm font-medium whitespace-nowrap">
                            내 친구
                        </p>
                    </div>
                </Link>

                <Link href="/student/phone/friends?status=request">
                    <div
                        onClick={handleRequestClick}
                        className={`
                        px-4 py-1.5 rounded-full cursor-pointer transition-all
                        ${!navFriendSelected
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500"
                            }
                    `}
                    >
                        <p className="text-sm font-medium whitespace-nowrap">
                            요청 관리
                        </p>
                    </div>
                </Link>
            </div>

            <div className="flex-1" />

            <SearchFriendModal />
        </div>
    );
}