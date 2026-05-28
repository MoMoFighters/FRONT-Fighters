'use client'

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import close from '@/app/assets/img/close.svg'

export default function EmailInputModal() {

    const [isModal, setIsModal] = useState(false) //모달 뜨냐마냐 여부
    const [invalidEmail, setInvalidEmail] = useState(false); //가입되지 않은 이메일입니다
    const [tempPwSent, setTempPwSent] = useState(false); //임시비번 전송 여부
    // 임시비번 전송
    const handleTempPwSend = () => {

    }


    if (!isModal) return (<p className="text-right text-slate-400 cursor-pointer mb-4" onClick={() => setIsModal(!isModal)}>비밀번호 찾기</p>)

    return (
        <>
            <p className="text-right text-slate-400 mb-4">
                비밀번호 찾기
            </p>
            <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={() => setIsModal(!isModal)}
            >
                <div
                    className="bg-white px-5 pb-8 pt-3 w-[40vw]  rounded flex flex-col justify-center align-middle"
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
                    {!tempPwSent ? (
                        <>
                            <div className="flex justify-center">
                                <p className={`mb-5 mt-2 text-lg font-bold ${invalidEmail ? 'text-red-500' : "text-slate-900"}`}>
                                    {!invalidEmail ?
                                        "모모시티에 가입된 이메일을 입력해주세요."
                                        : "가입되지 않은 이메일입니다."}
                                </p>
                            </div>
                            <div className="flex flex-row gap-2 mb-4">
                                <p className="my-auto mr-3">이메일</p>
                                <input
                                    type="email"
                                    placeholder="이메일"
                                    className="px-2 border border-black flex-1 w-30"
                                />
                                <Button
                                    onClick={handleTempPwSend}>
                                    임시 비밀번호 발송
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <p className="mb-5 mt-2 text-center text-lg font-bold">
                                    입력하신 이메일로 임시 비밀번호가 발급되었습니다.
                                </p>
                            </div>
                            <div className="flex justify-center">
                                <Button
                                    onClick={() => setIsModal(false)}
                                    className="px-7 py-2">
                                    닫기
                                </Button>
                            </div>
                        </>
                    )}
                    {/* <div className="flex flex-row gap-2">
                        <p className="my-auto w-15">인증번호</p>
                        <input type="text" placeholder="인증번호" className="px-2 border border-black flex-1" />
                        <Button>인증하기</Button>
                    </div> */}
                    {/* <div className="mt-2 flex justify-center">
                        <Button>임시 비밀번호 발급</Button>
                    </div> */}
                </div>
            </div >
        </>
    );
}