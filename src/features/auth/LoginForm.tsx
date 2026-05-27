'use client'

import { Button } from "@/components/ui/button";
import Image from "next/image";
import kakao from '@/app/assets/img/kakao.svg'
import google from '@/app/assets/img/google.svg'
import { useEffect, useState } from "react";
import Link from "next/link";
import { GOOGLE_AUTH_LINK } from "@/lib/auth/authAPI";

export default function LoginForm() {
    const googleAuthLink = GOOGLE_AUTH_LINK;

    const kakaoClientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    const kakaoRedirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
    const kakaoAuthLink = ``
    // const handleKakaoLogin = () => {
    //     Kakao.Auth.authorize({
    //         redirectUri: "http://localhost:3000/oauth/callback/kakao"
    //     });
    // };

    const [isTeacher, setIsTeacher] = useState(false)
    const nothingInFieldError = '';

    const leftBgColor = isTeacher ? "bg-slate-200" : "bg-slate-400"
    const rightBgColor = isTeacher ? "bg-slate-400" : "bg-slate-200"
    const leftTextColor = isTeacher ? "text-slate-900" : "text-slate-50"
    const rightTextColor = isTeacher ? "text-slate-50" : "text-slate-900"

    useEffect(() => {
        // 수영님한테 받아서 연결
        // Kakao.init(...)
    }, [])

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2">
                <div
                    className={`${leftBgColor} py-2 text-center cursor-pointer`}
                    onClick={() => setIsTeacher(false)}
                >
                    <p className={`${leftTextColor} font-bold`}>수강생</p>
                </div>
                <div
                    className={`${rightBgColor} py-2 text-center cursor-pointer`}
                    onClick={() => setIsTeacher(true)}
                >
                    <p className={`${rightTextColor} font-bold`}>강사</p>
                </div>
            </div>
            <form action="" className="flex flex-col gap-4">
                {/* <input type="hidden" name="role" value={isTeacher ? "teacher" : "student"} /> */}
                <input
                    type="email"
                    name="email"
                    className="border border-slate-300 py-2 px-2 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors"
                    placeholder="이메일 입력"
                />
                <div className="max-w-md">
                    <input
                        type="password"
                        name="password"
                        className="border border-slate-300 py-2 px-2 w-full text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors"
                        placeholder="비밀번호 입력"
                    />
                    {nothingInFieldError ? (
                        <p className="text-right mr-2 text-red-600 font-medium">{nothingInFieldError}</p>
                    ) : ("")}
                </div>
                <Button
                    variant="default"
                    className="w-auto py-6 cursor-pointer bg-mauve-500 rounded-none"
                >
                    <p className="font-bold text-[17px]">로그인</p>
                </Button>
            </form>

            {!isTeacher && (
                <>
                    <hr className="border-0.5 border-slate-300" />
                    <div
                        className="bg-yellow-300 border border-yellow-300 text-slate-900 font-bold text-center py-2 cursor-pointer flex items-center justify-center gap-1.5 rounded-none h-10"
                    // onClick={handleKakaoLogin}
                    >
                        <Image src={kakao} width={20} height={20} alt="카카오 아이콘" priority />
                        <p>카카오톡으로 계속하기</p>
                    </div>
                    <div
                        className="border border-slate-700 bg-slate-50 text-slate-700 font-bold text-center py-2 cursor-pointer flex items-center justify-center h-10 rounded-none">
                        <Link href={googleAuthLink} className="flex flex-row gap-1.5">
                            <Image src={google} width={20} height={20} alt="구글 아이콘" priority />
                            <p>구글로 계속하기</p>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}