'use client'

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function EmailInputModal() {

    const [isModal, setIsModal] = useState(false)

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
                    className="bg-white px-12 pb-8 pt-3 rounded flex flex-col justify-center align-middle"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-row">
                        <div className="flex-1"></div>
                        <p
                            className="text-right cursor-pointer"
                            onClick={() => setIsModal(!isModal)}
                        >
                            X
                        </p>
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
                </div>
            </div >
        </>
    );
}