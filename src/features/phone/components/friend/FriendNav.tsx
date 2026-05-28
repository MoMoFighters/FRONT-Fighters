'use client'
import Image from "next/image";
import Link from "next/link";
import SearchUserListPage from "@/app/student/phone/friends/search/page";
import SearchFriendModal from "./SearchFriendModal";
import { useState } from "react";

interface FriendNavProps {
    status: 'friend' | 'request'
}

export default function FriendNav({ status }: FriendNavProps) {

    const [navFriendSelected, setNavFriendSelected] = useState(status === "friend" ? true : false)

    const handleMyFriendClick = () => {
        setNavFriendSelected(true);
    }

    const handleRequestClick = () => {
        setNavFriendSelected(false);
    }

    return (
        <div className="w-full flex flex-row gap-1 border-b border-slate-200">
            <Link href='/student/phone/friends?status=friends'>
                <div
                    className={`ml-2 py-3 px-3 cursor-pointer ${navFriendSelected ? 'border-b-3 border-slate-900' : ""}`}
                    onClick={handleMyFriendClick}
                >
                    <p className={`text-md font-semibold ${navFriendSelected ? "text-slate-900" : "text-slate-500"}`}>내 친구</p>
                </div>
            </Link>
            <Link href='/student/phone/friends?status=request'>
                <div
                    className={`ml-2 py-3 px-3 cursor-pointer ${!navFriendSelected ? 'border-b-3 border-slate-900' : ""}`}
                    onClick={handleRequestClick}
                >
                    <p className={`text-md font-semibold ${!navFriendSelected ? "text-slate-900" : "text-slate-500"}`}>요청 관리</p>
                </div>
            </Link>
            <div className="flex-1"></div>
            <div className="flex justify-center my-auto mr-3 py-3">
                {/* 온클릭으로 검색 모달 띄우기 */}
                <SearchFriendModal />
            </div>
        </div >
    );
}