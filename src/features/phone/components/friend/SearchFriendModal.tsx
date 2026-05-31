'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import close from '@/app/assets/img/close.svg'
import search from "@/app/assets/img/user-plus.svg"
import { Button } from "@/components/ui/button";
import FriendItem from "@/components/phone/friends/FriendItem";
import { searchUserAction } from "../../chatAction";

interface friendInfo {
    userId: number;
    name: string;
    status: 'none' | 'SENT' | 'FRIEND' | 'RECEIVED' | 'BLOCK';
    role: 'STUDENT' | 'TEACHER';
    profileImageUrl: string;
    lectureTitle?: string;
}

interface SearchFriendModalProps {
    searchModal: boolean;
    setSearchModal: any;
}

export default function SearchFriendModal() {

    const [users, setUsers] = useState<friendInfo[]>([])
    // const users: friendInfo[] = [];

    const [isModal, setIsModal] = useState(false)
    const [searchValue, setSearchValue] = useState('');
    const [message, setMessage] = useState('닉네임을 통해 검색해보세요');

    const handleSearch = async (e: any) => {
        e.preventDefault();
        const data = await searchUserAction(searchValue);
        console.log(data);
        const searchResult = data?.data ?? [];
        // 학생만
        const filteredResult = searchResult.filter(user => user.role === 'STUDENT')
        setUsers(filteredResult)
        setMessage(filteredResult.length === 0 ? "존재하지 않는 사용자입니다. 닉네임을 확인해주세요." : data?.message);
    }

    if (!isModal) return (
        <div
            className=" pr-2 py-auto flex justify-center cursor-pointer"
            onClick={() => setIsModal(true)}
        >
            <Image src={search} alt='친구추가' className="w-5 h-5"></Image>
        </div>
    )

    return (
        <>
            <div
                className="pr-2 py-auto flex justify-center cursor-pointer"
            >
                <Image src={search} alt='친구추가' className="w-5 h-5"></Image>
            </div>
            <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={() => setIsModal(!isModal)}
            >
                <div
                    className="bg-white px-7 pb-8 pt-3 w-[40vw] h-[40vw] rounded flex flex-col align-middle"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-row mt-2">
                        <div className="flex-1"></div>
                        <Image src={close} onClick={() => setIsModal(!isModal)} alt='닫기' className="w-7 h-7 cursor-pointer" />
                    </div>
                    <div className="mt-2">
                        <p className="font-bold text-center text-xl mb-2">친구 찾기</p>
                    </div>
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-row gap-2 mt-2"
                    >
                        <input
                            type="text"
                            className="flex-1 border border-slate-300 py-2 px-2 w-full text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors"
                            placeholder="닉네임을 입력하세요..."
                            name='name'
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                        <Button
                            className="py-auto h-10.5 px-4 bg-mauve-500"
                            type='submit'
                            disabled={!searchValue}
                        >
                            검색
                        </Button>
                    </form>
                    <div className="overflow-y-scroll h-full scrollbar-none mt-2 gap-1">
                        {users.length !== 0 ?
                            users.filter(user => user.status === "none").map(user => (
                                <FriendItem friendInfo={{ status: user.status, name: user.name, profile: user.profileImageUrl, userId: user.userId }} key={user.userId} />
                            ))
                            : (
                                <div className="flex justify-center align-middle h-full">
                                    <p className="my-auto py-auto font-bold text-xl text-slate-900">
                                        {message}
                                    </p>
                                </div>
                            )}
                    </div>
                </div>
            </div >
        </>
    );
}