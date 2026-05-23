import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Login() {

    // const nothingInFieldError = '이메일 또는 비밀번호를 입력해주세요.';
    const nothingInFieldError = '';

    return (
        <div className="p-4 flex flex-col gap-4 justify-center align-middle max-w-md mx-auto my-auto">
            <div className="text-center text-3xl font-bold">🍑MOMOCITY</div>
            <div className="grid grid-cols-2">
                <div className="bg-mauve-500 py-2 text-center">
                    <p className="text-white font-bold">수강생</p>
                </div>
                <div className="bg-mauve-200 py-2 text-center">
                    <p className="text-black font-bold">강사</p>
                </div>
            </div>

            <form action="" className="flex flex-col gap-4">
                <input
                    type="email"
                    className="border border-black py-2 px-2"
                    placeholder="이메일 입력"
                />
                <div className="max-w-md">
                    <input
                        type="password"
                        className="border border-black py-2 px-2 w-full"
                        placeholder="비밀번호 입력"
                    />
                    {nothingInFieldError ? (<p className="text-right mr-2 text-red-600 font-medium">{nothingInFieldError}</p>) : ("")}
                </div>
                <Button variant="default" className="w-auto py-6 cursor-pointer">로그인</Button>
            </form>

            <hr className="border-0.5 border-black" />
            <div className="bg-yellow-300 font-bold text-center py-2 cursor-pointer">
                <p>카카오톡으로 계속하기</p>
            </div>
            <div className="border border-black font-bold text-center py-2 cursor-pointer">
                <p>구글로 계속하기</p>
            </div>
            <hr className="border-0.5 border-black" />
            <div className="flex flex-row justify-center gap-7">
                <p className="text-right">비밀번호 찾기</p>
                <Link href='/auth/signup'><p className="text-left">회원가입</p></Link>
            </div>
        </div>
    );
}

