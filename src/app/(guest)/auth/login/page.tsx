import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import kakao from '@/app/assets/img/kakao.svg'
import google from '@/app/assets/img/google.svg'
import logo from '@/app/assets/img/header_logo.png'

export default function Login() {

    // const nothingInFieldError = '이메일 또는 비밀번호를 입력해주세요.';
    const nothingInFieldError = '';

    return (
        <div className="p-4 flex flex-col gap-4 justify-center align-middle max-w-md mx-auto my-auto">
            <div className="flex justify-center">
                <Image
                    src={logo}
                    width={180}
                    alt="MOMOCITY 로고"
                    priority
                />
            </div>
            <div className="grid grid-cols-2">
                <div className="bg-mauve-500 py-2 text-center">
                    <p className="text-white font-bold">수강생</p>
                </div>
                <div className="bg-mauve-200 py-2 text-center">
                    <p className="text-slate-900 font-bold">강사</p>
                </div>
            </div>

            <form action="" className="flex flex-col gap-4">
                <input
                    type="email"
                    name="email"
                    className="border border-slate-300 py-2 px-2"
                    placeholder="이메일 입력"
                />
                <div className="max-w-md">
                    <input
                        type="password"
                        name="password"
                        className="border border-slate-300 py-2 px-2 w-full"
                        placeholder="비밀번호 입력"
                    />
                    {nothingInFieldError ? (<p className="text-right mr-2 text-red-600 font-medium">{nothingInFieldError}</p>) : ("")}
                </div>
                <Button variant="default" className="w-auto py-6 cursor-pointer">로그인</Button>
            </form>

            <hr className="border-0.5 border-slate-300" />
            <div className="bg-yellow-300 text-slate-900 font-bold text-center py-2 cursor-pointer flex items-center justify-center gap-1.5">
                <Image
                    src={kakao}
                    width={20}
                    height={20}
                    alt="카카오 아이콘"
                    priority
                />
                <p>카카오톡으로 계속하기</p>
            </div>
            <div className="border border-slate-700 text-slate-700 font-bold text-center py-2 cursor-pointer flex items-center justify-center gap-1.5">
                <Image
                    src={google}
                    width={20}
                    height={20}
                    alt="구글 아이콘"
                    priority
                />
                <p>구글로 계속하기</p>
            </div>
            <hr className="border-0.5 border-slate-300" />
            <div className="flex flex-row justify-center gap-7">
                <p className="text-right text-slate-400">비밀번호 찾기</p>
                <Link href='/auth/signup'><p className="text-left text-slate-400">회원가입</p></Link>
            </div>
        </div>
    );
}

