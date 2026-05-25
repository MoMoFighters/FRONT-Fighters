'use client'

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import close from '@/app/assets/img/close.svg'

export default function EmailInputModal() {

    const [isModal, setIsModal] = useState(false) //모달 뜨냐마냐 여부
    const [invalidEmail, setInvalidEmail] = useState(false); //등록되지 않은 이메일입니다


    if (!isModal) return (<p className="text-right text-slate-400 cursor-pointer" onClick={() => setIsModal(!isModal)}>비밀번호 찾기</p>)

    return (
        <>
            <p className="text-right text-slate-400">
                비밀번호 찾기
            </p >
            <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={() => setIsModal(!isModal)}
            >
                <div
                    className="bg-white px-12 pb-8 pt-3 w-[40vw]  rounded flex flex-col justify-center align-middle"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-row">
                        <div className="flex-1"></div>
                        {/* <p
                            className="cursor-pointer"
                            onClick={() => setIsModal(!isModal)}
                        >
                            X
                        </p> */}
                        <Image src={close} onClick={() => setIsModal(!isModal)} alt='닫기' className="w-7 h-7 cursor-pointer" />
                    </div>
                    <h1 className="text-center text-2xl font-semibold mb-4">비밀번호 찾기</h1>
                    <div className="flex flex-row gap-2 mb-4">
                        <p className="my-auto w-15">이메일</p>
                        <input type="email" placeholder="이메일" className="px-2 border border-black flex-1" />
                        <Button>인증번호 발송</Button>
                    </div>
                    <div className="flex flex-row gap-2">
                        <p className="my-auto w-15">인증번호</p>
                        <input type="text" placeholder="인증번호" className="px-2 border border-black flex-1" />
                        <Button>인증하기</Button>
                    </div>
                    <div className="mt-2 flex justify-center">
                        <Button>임시 비밀번호 발급</Button>
                    </div>
                </div>
            </div >
        </>
    );
}