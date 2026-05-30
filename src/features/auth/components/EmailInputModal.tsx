'use client'

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useActionState, useEffect, useState } from "react";

import close from '@/app/assets/img/close.svg';

import { tempPwAction, } from "../action";


export default function EmailInputModal() {

    const [
        isModal,
        setIsModal
    ] = useState(false);

    const [
        invalidEmail,
        setInvalidEmail
    ] = useState(false);

    const [
        tempPwSent,
        setTempPwSent
    ] = useState(false);


    // action state
    const [state, formAction, pending] = useActionState(tempPwAction,
        { success: false, message: '' });


    // 결과 처리
    useEffect(() => {
        if (!state.message) {
            return;
        }
        // 성공
        if (state.success) {
            setTempPwSent(true);
            setInvalidEmail(false);
            return;
        }
        // 실패
        setInvalidEmail(true);
    }, [state]);


    if (!isModal) {
        return (
            <p
                className="text-right text-slate-400 cursor-pointer mb-4"
                onClick={() =>
                    setIsModal(true)
                }
            >
                비밀번호 찾기
            </p>
        );
    }


    return (
        <>
            <p className="text-right text-slate-400 mb-4">
                비밀번호 찾기
            </p>
            <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={() => setIsModal(false)}
            >
                <div
                    className="bg-white px-5 pb-8 pt-3 w-[40vw] rounded flex flex-col justify-center align-middle"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* 닫기 */}
                    <div className="flex flex-row">
                        <div className="flex-1"></div>
                        <Image
                            src={close}
                            alt='닫기'
                            className="w-7 h-7 cursor-pointer"
                            onClick={() => setIsModal(false)}
                        />

                    </div>

                    <h1 className="text-center text-2xl font-semibold mb-4">
                        비밀번호 찾기
                    </h1>
                    {!tempPwSent ? (
                        <form action={formAction}>
                            <div className="flex justify-center">
                                <p className='mb-5 mt-2 text-lg font-bold text-slate-900'>

                                    {
                                        !invalidEmail
                                            ? '모모시티에 가입된 이메일을 입력해주세요.'
                                            : state.message
                                    }

                                </p>

                            </div>


                            <div className="flex flex-row gap-3 mb-4 items-center px-2">

                                <p className="my-automr-3">
                                    이메일
                                </p>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="이메일"
                                    className="border border-slate-300 py-2 px-2 flex-1 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors"
                                />

                                <Button
                                    disabled={pending}
                                    className="w-30"
                                >
                                    {
                                        pending
                                            ? '발송 중...'
                                            : '임시 비밀번호 발송'
                                    }
                                </Button>

                            </div>

                        </form>

                    ) : (
                        <>
                            <div>
                                <p className="mb-5 mt-2 text-center text-lg font-bold">
                                </p>
                            </div>

                            <div className="flex justify-center">
                                <Button
                                    onClick={() =>
                                        setIsModal(false)
                                    }
                                    className="px-7 py-2"
                                >
                                    닫기
                                </Button>

                            </div>
                        </>
                    )}

                </div>

            </div>
        </>
    );
}