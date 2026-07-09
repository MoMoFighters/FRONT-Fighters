'use client';

import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import kakao from "@/app/assets/img/kakao.svg";
import Link from "next/link";
import { useEffect, useState } from "react";
import googleIcon from "@/app/assets/img/google.svg";
import naverIcon from "@/app/assets/img/NAVER_login_Dark_KR_green_icon_H56.png";
import { loginAction } from "../action";
import LoginResultModal from "./LoginResultModal";
import EmailInputModal from "./EmailInputModal";
import { UserRole, UserStatus } from "@/features/user/type";
import { ApiResponse } from "@/lib/api";
import type { OAuthClientConfig } from "@/lib/config/oauth/oauthAPI";

interface LoginData {
    accessToken: string;
    refreshToken: string;
    status: UserStatus;
    role: UserRole;
    isTempPwd: boolean;
    nickname: string | null;
    expiresIn: number;
}

interface LoginFormProps {
    oauthConfig: OAuthClientConfig;
}

export default function LoginForm({
    oauthConfig,
}: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const [loginResult, setLoginResult] = useState<ApiResponse<LoginData>>({
        timestamp: "",
        status: 0,
        code: "",
        message: "",
    });

    const handleKakaoLogin = () => {
        window.Kakao.Auth.authorize({
            redirectUri: oauthConfig.kakaoRedirectUri,
        });
    };

    useEffect(() => {
        if (
            typeof window !== "undefined" &&
            window.Kakao &&
            !window.Kakao.isInitialized()
        ) {
            window.Kakao.init(oauthConfig.javascriptKey);
        }
    }, [oauthConfig.javascriptKey]);

    const handleSubmit = async (formData: FormData) => {
        if (isPending || isModal) {
            return;
        }

        setIsPending(true);
        (document.activeElement as HTMLElement | null)?.blur();

        try {
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;
            const result = await loginAction(email, password);

            setLoginResult(result);
            setIsModal(true);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <div className="flex flex-col">
                <form
                    action={handleSubmit}
                    className="flex flex-col gap-3.5"
                    onKeyDown={(e) => {
                        if (isModal && e.key === "Enter") {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }}
                >
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-300" />
                        <input
                            type="email"
                            name="email"
                            placeholder="이메일을 입력해 주세요"
                            className="h-[50px] w-full rounded-md border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-300 focus:ring-3 focus:ring-indigo-50"
                        />
                    </div>

                    <div className="relative">
                        <LockKeyhole className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-300" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="비밀번호를 입력해 주세요"
                            className="h-[50px] w-full rounded-md border border-slate-200 bg-white pl-11 pr-12 text-sm font-medium text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-300 focus:ring-3 focus:ring-indigo-50"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-slate-600"
                            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="mt-1.5 h-[50px] w-full cursor-pointer rounded-md bg-indigo-500 text-base font-bold text-white hover:bg-indigo-600 disabled:bg-slate-300"
                    >
                        {isPending ? "로그인 중..." : "로그인"}
                    </Button>
                </form>

                <Link
                    href="/auth/signup"
                    className="mt-3 flex h-[50px] w-full items-center justify-center rounded-md border border-slate-200 bg-white text-base font-bold text-slate-800 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                >
                    회원가입
                </Link>

                <div className="mt-3.5 flex items-center justify-center gap-3 text-[13px] font-semibold text-slate-500">
                    <Link
                        href="/"
                        className="transition-colors hover:text-indigo-500"
                    >
                        홈
                    </Link>
                    <span className="h-3 w-px bg-slate-300" aria-hidden="true" />
                    <EmailInputModal />
                </div>

                <div className="mt-5 px-2 py-2">
                    <div className="flex w-full items-center gap-4">
                        <div className="flex-1 border-t border-slate-200" />

                        <span className="shrink-0 text-[13px] font-semibold text-slate-500">
                            SNS 계정으로 시작하기
                        </span>

                        <div className="flex-1 border-t border-slate-200" />
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                        <a
                            href={oauthConfig.googleAuthLink}
                            className="flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                        >
                            <Image src={googleIcon} alt="구글" width={20} height={20} />
                            Google
                        </a>
                        <button
                            type="button"
                            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                            onClick={handleKakaoLogin}
                        >
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-300">
                                <Image
                                    src={kakao}
                                    width={14}
                                    height={14}
                                    alt="카카오"
                                    priority
                                />
                            </span>
                            카카오톡
                        </button>
                        <a
                            href="/oauth/naver/start"
                            className="flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                        >
                            <Image src={naverIcon} alt="네이버" width={22} height={22} />
                            네이버
                        </a>
                    </div>
                </div>
            </div>

            {isModal && (
                <LoginResultModal
                    setIsModal={setIsModal}
                    result={loginResult}
                />
            )}
        </>
    );
}
