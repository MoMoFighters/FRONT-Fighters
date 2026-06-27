'use client'

import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import kakao from '@/app/assets/img/kakao.svg';
import Link from "next/link";
import { useEffect, useState } from "react";
import googleIcon from "@/app/assets/img/google.svg"
import naverIcon from "@/app/assets/img/NAVER_login_Dark_KR_green_icon_H56.png"

import {
    GOOGLE_AUTH_LINK,
    javascriptkey,
} from "@/lib/config/oauth/oauthAPI";

import {
    loginAction,
} from "../action";

import LoginResultModal from "./LoginResultModal";
import EmailInputModal from "./EmailInputModal";

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
        if (isPending || isModal) {
            return;
        }

        setIsPending(true);
        (document.activeElement as HTMLElement | null)?.blur();

        try {
            const email = formData.get('email') as string;
            const password = formData.get('password') as string;

            const result =
                await loginAction(
                    email,
                    password
                );

            setState(result);
            setIsModal(true);
        } finally {
            setIsPending(false);
        }

    };


    return (
        <>
            <div className="flex flex-col gap-1">

                <form
                    action={handleSubmit}
                    className="flex flex-col gap-6"
                    onKeyDown={(e) => {
                        if (isModal && e.key === 'Enter') {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }}
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
                                text-[15px]
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
                                        text-[15px]
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
                                py-5
                                cursor-pointer
                                bg-indigo-500
                                hover:bg-indigo-600
                                rounded-none
                            "
                    >
                        <p className="font-bold text-[16px]">
                            {
                                isPending
                                    ? '로그인 중...'
                                    : '로그인'
                            }
                        </p>
                    </Button>

                </form>

                <div className="flex flex-row justify-center gap-7 mb-10">
                    <EmailInputModal />
                    <Link href='/auth/signup'>
                        <button
                            type="button"
                            className="cursor-pointer text-sm font-medium text-slate-400 transition-colors hover:text-slate-700"
                        >
                            회원가입
                        </button>
                    </Link>
                </div>
                <hr className="border-0.5 border-slate-300 mt-[-16] mb-4" />

                <div className="flex flex-row gap-10 justify-center">
                    <Image
                        src={kakao}
                        width={36}
                        height={36}
                        alt="카카오"
                        priority
                        className="bg-yellow-300 rounded-full p-2 w-10 h-10 cursor-pointer hover:translate-y-0.5"
                        onClick={
                            handleKakaoLogin
                        }
                    />
                    <a href={googleAuthLink}>
                        <Image src={googleIcon} alt='구글' width={40} height={40} className="border-2 border-slate-100 hover:border-slate-400 hover:translate-y-0.5 rounded-full p-2" />
                    </a>
                    <a href="/oauth/naver/start">
                        <Image src={naverIcon} alt="네이버" width={40} height={40} className="hover:translate-y-0.5" />
                    </a>
                </div>

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
