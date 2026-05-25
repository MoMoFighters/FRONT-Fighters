'use client'
import { Button } from "@/components/ui/button";

export default function Signup() {

    const isTeacher = true //강사여부(희망분야 및 인증자료 업로드 뜨냐마냐)
    const leftNavBarBgColor = isTeacher ? "bg-mauve-200" : "bg-mauve-500"
    const rightNavBarBgColor = isTeacher ? "bg-mauve-500" : "bg-mauve-200"
    const leftNavBarTextColor = isTeacher ? "text-black" : "text-white"
    const rightNavBarTextColor = isTeacher ? "text-white" : "text-black"
    const emailValidationClicked = true; // 인증번호칸 뜨냐마냐 여부(이메일인증 눌렀을때 뜨게끔)
    const emailValidated = true; //인증 완료 시 input비활성화 등등 작업
    const remainTime = "4:44"   //인증번호 만료까지 남은 시간
    const emailValidatedTextStyle = emailValidated ? "text-right mr-45" : "text-right mr-45 text-red-500"
    const emailValidationInputStyle = emailValidated ? 'border border-black py-2 pl-2 flex-1 bg-gray-300' : 'border border-black py-2 pl-2 flex-1'

    return (
        <>
            <div className="flex items-center justify-center min-h-screen">
                <div className="p-4 flex flex-col gap-4 justify-center align-middle w-xl mx-auto">
                    <div className="text-center text-2xl">🍑MOMOCITY</div>
                    <div className="grid grid-cols-2 mx-3">
                        <div className={`${leftNavBarBgColor} py-2 text-center`}>
                            <p className={`${leftNavBarTextColor} font-bold`}>수강생</p>
                        </div>
                        <div className={`${rightNavBarBgColor} py-2 text-center`}>
                            <p className={`${rightNavBarTextColor} font-bold`}>강사</p>
                        </div>
                    </div>
                    <h1 className="text-center text-2xl">{isTeacher ? "회원가입(강사)" : "회원가입(학생)"}</h1>
                    <form action="" className="flex flex-col gap-2">
                        {/* 나중에 폼 따로 분리하기? -> 근데 fetching 하는게 없어서 걍 이 자체 페이지를 use client하면될듯 */}
                        <div className="grid grid-cols-[1fr_3fr]">
                            <p className='text-right font-bold mr-2 my-auto'>이름</p>
                            <input
                                className='border border-black py-2 pl-2'
                                type="text"
                                placeholder="이름"
                                name='name'
                                required
                            />
                        </div>
                        <div className="grid grid-cols-[1fr_3fr]">
                            <p className='text-right font-bold mr-2 my-auto'>이메일</p>
                            <div className="flex flex-row">
                                <input
                                    className='border border-black py-2 pl-2 flex-1'
                                    type="email"
                                    placeholder="이메일"
                                    name='email'
                                    required
                                />
                                <Button type="button" className="ml-1 my-auto">이메일인증</Button>
                            </div>
                        </div>
                        {emailValidationClicked ? (
                            <div className="flex flex-col">
                                <div className="grid grid-cols-[1fr_3fr]">
                                    <p className='text-right font-bold mr-2 my-auto'>인증번호</p>
                                    <div className="flex flex-row">
                                        <input
                                            className={`${emailValidationInputStyle} [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                                            type="number"
                                            placeholder="인증번호"
                                            disabled={emailValidated}
                                            name='validationCode'
                                            required
                                        />                                        {/* 나중에 이메일인증코드 컨벤션 맞춰서 name 수정 */}
                                        <Button
                                            type="button"
                                            className="mx-1 my-auto"
                                            disabled={emailValidated}
                                        >인증하기</Button>
                                        <Button
                                            type="button"
                                            className="my-auto"
                                            disabled={emailValidated}
                                        >코드 재전송</Button>
                                    </div>
                                </div>
                                <p className={emailValidatedTextStyle}>
                                    {emailValidated ? "이메일 인증이 완료되었습니다." : `남은 시간 : ${remainTime}`}
                                </p>
                            </div>
                        ) : ("")}
                        <div className="grid grid-cols-[1fr_3fr]">
                            <p className='text-right font-bold mr-2 my-auto'>PW</p>
                            <input
                                className='border border-black py-2 pl-2'
                                type="password"
                                placeholder="비밀번호"
                                name='password'
                                required
                            />
                        </div>
                        <div className="grid grid-cols-[1fr_3fr]">
                            <p className='text-right font-bold mr-2 my-auto'>PW 확인</p>
                            <input
                                className='border border-black py-2 pl-2'
                                type="password"
                                placeholder="비밀번호확인"
                                name="passwordCheck"
                                required
                            />
                        </div>
                        {isTeacher ? (
                            <div className="grid grid-cols-[1fr_3fr]">
                                <p className='text-right font-bold mr-2 my-auto'>희망 강의 분야</p>
                                <select className='border border-black py-2 pl-2' name="category">
                                    <option value="study">학문</option>
                                    <option value="art">예체능</option>
                                    <option value="health">헬스케어</option>
                                    <option value="beauty">뷰티</option>
                                    <option value="cook">요리</option>
                                </select>
                            </div>
                        ) : ("")}
                        <Button className="py-5 px-2 mx-30">회원가입</Button>
                    </form>
                </div>
            </div >
        </>
    );
}