'use client'
import Image from "next/image";
import user from '@/app/assets/img/user.svg'
import { useEffect, useState } from "react";
import close from '@/app/assets/img/close.svg'
import search from "@/app/assets/img/user-plus.svg"
import { Button } from "@/components/ui/button";
import FriendItem from "@/components/phone/friends/FriendItem";

interface friendInfo {
    userId: number;
    name: string;
    status: 'sent' | 'recieved' | 'block';
    profile: string;
}

export default function SearchFriendModal() {

    const users: friendInfo[] = [
        { userId: 1, name: '김철수', status: 'sent', profile: '김' },
        { userId: 2, name: '이영희', status: 'recieved', profile: '이' },
        { userId: 3, name: '박민준', status: 'block', profile: '박' },
        { userId: 4, name: '최수진', status: 'sent', profile: '최' },
        { userId: 5, name: '정호준', status: 'recieved', profile: '정' },
        { userId: 6, name: '한지민', status: 'sent', profile: '한' },
        { userId: 7, name: '윤서연', status: 'block', profile: '윤' },
        { userId: 8, name: '강동현', status: 'recieved', profile: '강' },
        { userId: 9, name: '임나영', status: 'sent', profile: '임' },
        { userId: 10, name: '송재원', status: 'block', profile: '송' },
        { userId: 11, name: '오지훈', status: 'recieved', profile: '오' },
        { userId: 12, name: '배수현', status: 'sent', profile: '배' },
        { userId: 13, name: '신동엽', status: 'block', profile: '신' },
        { userId: 14, name: '황민서', status: 'recieved', profile: '황' },
        { userId: 15, name: '류지아', status: 'sent', profile: '류' },
    ]
    // const users: friendInfo[] = [];

    const [isModal, setIsModal] = useState(false)

    // const [users, setUsers] = useState([]);

    useEffect(() => {
        // 나중에 데이터 패칭 받아서 상태관리하기
    }, [])

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
                        action=""
                        className="flex flex-row gap-2 mt-2"
                    >
                        <input
                            type="text"
                            className="flex-1 border border-slate-300 py-2 px-2 w-full text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors"
                            placeholder="닉네임을 입력하세요..."
                            name='nickname'
                        />
                        <Button
                            className="py-auto h-10.5 px-4 bg-mauve-500"
                            type='button'
                        >
                            검색
                        </Button>
                    </form>
                    <div className="overflow-y-scroll h-full scrollbar-none mt-2">
                        {users.length !== 0 ?
                            users.map(user => (
                                <FriendItem friendInfo={{ name: user.name, profile: user.profile, userId: user.userId }} />
                            ))
                            : (
                                <div className="flex justify-center align-middle h-full">
                                    <p className="my-auto py-auto font-bold text-xl text-slate-900">
                                        해당 조건으로 검색된 유저가 없습니다.
                                    </p>
                                </div>
                            )}
                    </div>
                </div>
            </div >
        </>
    );
}