'use client'
import Image from "next/image";
import user from '@/app/assets/img/user.svg'
import { useEffect, useState } from "react";
import close from '@/app/assets/img/close.svg'
import { Button } from "@/components/ui/button";

export default function SearchFriendModal() {

    const [isModal, setIsModal] = useState(false)

    const [users, setUsers] = useState([]);

    useEffect(() => {
        // 나중에 데이터 패칭 받아서 상태관리하기
    }, [])

    if (!isModal) return (
        <div
            className="bg-slate-200 pr-2 py-auto flex justify-center cursor-pointer"
            onClick={() => setIsModal(true)}
        >
            <Image src={user} alt='친구추가'></Image>
            <p className="font-bold">+</p>
        </div>
    )

    return (
        <>
            <div
                className="bg-slate-200 pr-2 py-auto flex justify-center cursor-pointer"
            >
                <Image src={user} alt='친구추가'></Image>
                <p className="font-bold">+</p>
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
                        <p className="font-bold text-center text-xl">친구 찾기</p>
                    </div>
                    <form
                        action=""
                        className="flex flex-row gap-2 mt-2"
                    >
                        <input
                            type="text"
                            className="p-2 flex-1 border border-black"
                            placeholder="닉네임을 입력하세요..."
                        />
                        <Button>검색</Button>
                    </form>
                    <div className="overflow-y-scroll h-full">
                    </div>
                </div>
            </div >
        </>
    );
}