'use client'

import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import kakao from '@/app/assets/img/kakao.svg';
import google from '@/app/assets/img/google.svg';
import Link from "next/link";
import { useEffect, useState } from "react";

import {
    GOOGLE_AUTH_LINK,
    javascriptkey,
} from "@/lib/config/oauth/oauthAPI";

import {
    loginAction,
} from "../action";

import LoginResultModal from "./LoginResultModal";

interface LoginActionState {
    timestamp: string;
    status: number;
    code: string;
    message: string;
}

export default function LoginForm() {

    const googleAuthLink =
        GOOGLE_AUTH_LINK;

    const [showPassword, setShowPassword] =
        useState(false);

    const [isTeacher, setIsTeacher] =
        useState(false);

    const [isPending, setIsPending] =
        useState(false);

    const [isModal, setIsModal] =
        useState(false);

    const [state, setState] =
        useState<LoginActionState>({
            timestamp: '',
            status: 0,
            code: '',
            message: '',
        });

    const handleKakaoLogin = () => {
        window.Kakao.Auth.authorize({
            redirectUri:
                process.env
                    .NEXT_PUBLIC_KAKAO_REDIRECT_URI,
        });
    };

    useEffect(() => {

        if (
            typeof window !== 'undefined' &&
            window.Kakao &&
            !window.Kakao.isInitialized()
        ) {
            window.Kakao.init(
                javascriptkey
            );
        }

    }, []);

    const handleSubmit = async (
        formData: FormData
    ) => {

        setIsPending(true);

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const result =
            await loginAction(
                email,
                password
            );

        setState(result);

        setIsModal(true);

        setIsPending(false);
    };

    const leftBgColor =
        isTeacher
            ? 'bg-slate-200'
            : 'bg-slate-400';

    const rightBgColor =
        isTeacher
            ? 'bg-slate-400'
            : 'bg-slate-200';

    const leftTextColor =
        isTeacher
            ? 'text-slate-900'
            : 'text-slate-50';

    const rightTextColor =
        isTeacher
            ? 'text-slate-50'
            : 'text-slate-900';

    return (
        <>
            <div className="flex flex-col gap-4">

                <div className="grid grid-cols-2">

                    <div
                        className={`${leftBgColor} py-2 text-center cursor-pointer`}
                        onClick={() =>
                            setIsTeacher(false)
                        }
                    >
                        <p className={`${leftTextColor} font-bold`}>
                            수강생
                        </p>
                    </div>

                    <div
                        className={`${rightBgColor} py-2 text-center cursor-pointer`}
                        onClick={() =>
                            setIsTeacher(true)
                        }
                    >
                        <p className={`${rightTextColor} font-bold`}>
                            강사
                        </p>
                    </div>

                </div>

                <form
                    action={handleSubmit}
                    className="flex flex-col gap-4"
                >

                    <input
                        type="email"
                        name="email"
                        placeholder="이메일 입력"
                        className="
                            border border-slate-300
                            py-2 px-2
                            text-slate-700
                            placeholder:text-slate-400
                            focus:outline-none
                            focus:border-slate-500
                        "
                    />

                    <div className="max-w-md">

                        <div className="relative">

                            <input
                                type={
                                    showPassword
                                        ? 'text'
                                        : 'password'
                                }
                                name="password"
                                placeholder="비밀번호 입력"
                                className="
                                    border border-slate-300
                                    py-2 px-2
                                    w-full
                                    pr-10
                                    text-slate-700
                                    placeholder:text-slate-400
                                    focus:outline-none
                                    focus:border-slate-500
                                "
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        (prev) => !prev
                                    )
                                }
                                className="
                                    absolute
                                    right-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-500
                                "
                            >
                                {
                                    showPassword
                                        ? <EyeOff size={18} />
                                        : <Eye size={18} />
                                }
                            </button>

                        </div>

                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="
                            w-auto
                            py-6
                            cursor-pointer
                            bg-mauve-500
                            rounded-none
                        "
                    >
                        <p className="font-bold text-[17px]">
                            {
                                isPending
                                    ? '로그인 중...'
                                    : '로그인'
                            }
                        </p>
                    </Button>

                </form>

                {!isTeacher && (
                    <>
                        <hr className="border-0.5 border-slate-300" />

                        <div
                            className="bg-yellow-300 border border-yellow-300 text-slate-900 font-bold text-center py-2 cursor-pointer flex items-center justify-center gap-1.5 rounded-none h-12.5"
                            onClick={
                                handleKakaoLogin
                            }
                        >
                            <Image
                                src={kakao}
                                width={20}
                                height={20}
                                alt="카카오"
                                priority
                            />
                            <p>
                                카카오톡으로 계속하기
                            </p>
                        </div>

                        <Link
                            href={googleAuthLink}
                            className="
                                flex-row
                                gap-1.5
                                border
                                border-slate-700
                                bg-slate-50
                                text-slate-700
                                font-bold
                                text-center
                                py-2
                                cursor-pointer
                                flex
                                items-center
                                justify-center
                                h-12.5
                                rounded-none
                            "
                        >
                            <Image
                                src={google}
                                width={20}
                                height={20}
                                alt="구글"
                                priority
                            />
                            <p>
                                구글로 계속하기
                            </p>
                        </Link>
                    </>
                )}

            </div>

            {
                isModal && (
                    <LoginResultModal
                        setIsModal={
                            setIsModal
                        }
                        state={state}
                    />
                )
            }
        </>
    );
}