'use client'

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SignupForm() {

    //강사 여부
    const [isTeacher, setIsTeacher] = useState(false)
    //기능
    const [emailValidationClicked, setEmailValidationClicked] = useState(false); //인증번호 받기 누를때 인증번호칸 뜨게하기
    const [emailValidated, setEmailValidated] = useState(false); //인증완료 시 아래 글자뜨는거 
    const [remainTime, setRemainTime] = useState("4:44") //시간 받아오기 -> 렌더링방식 고려 필요(ISR 1초로 해야할듯)
    //스타일
    const leftNavBarBgColor = isTeacher ? "bg-mauve-200" : "bg-mauve-500"
    const rightNavBarBgColor = isTeacher ? "bg-mauve-500" : "bg-mauve-200"
    const leftNavBarTextColor = isTeacher ? "text-black" : "text-white"
    const rightNavBarTextColor = isTeacher ? "text-white" : "text-black"
    const emailValidatedTextStyle = emailValidated ? "text-right mr-45" : "text-right mr-45 text-red-500"
    const emailValidationInputStyle = emailValidated ? 'border border-black py-2 pl-2 flex-1 bg-gray-300' : 'border border-black py-2 pl-2 flex-1'

    return (
        < >
            <h1 className="text-center text-2xl font-bold">회원가입</h1>
            <div className="grid grid-cols-2 ">
                <div
                    className={`${leftNavBarBgColor} py-2 text-center cursor-pointer`}
                    onClick={() => setIsTeacher(false)}
                >
                    <p className={`${leftNavBarTextColor} font-bold`}>수강생</p>
                </div>
                <div
                    className={`${rightNavBarBgColor} py-2 text-center cursor-pointer`}
                    onClick={() => setIsTeacher(true)}
                >
                    <p className={`${rightNavBarTextColor} font-bold`}>강사</p>
                </div>
            </div>
            <form
                action=""
                className="grid grid-cols-[110px_minmax(0,1fr)] gap-x-4 gap-y-4 items-center w-full"
            >
                <input
                    type="hidden"
                    name="role"
                    value={isTeacher ? "teacher" : "student"}
                />
                <label className="text-right font-bold" htmlFor="name">
                    이름
                </label>
                <input
                    className="border border-slate-300 py-2 px-2 min-w-0 h-10 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors"
                    type="text"
                    placeholder="이름"
                    name="name"
                    id='name'
                    required
                />
                <label className="text-right font-bold" htmlFor="email">
                    이메일
                </label>
                <div className="flex gap-2 min-w-0">
                    <input
                        className="border border-slate-300 py-2 px-2 flex-1 min-w-0 h-10 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors"
                        type="email"
                        placeholder="이메일"
                        name="email"
                        id="email"
                        required
                    />
                    <Button
                        type="button"
                        className="shrink-0 bg-mauve-500 rounded-none h-10"
                        onClick={() => setEmailValidationClicked(true)}
                    >
                        인증 요청
                    </Button>
                </div>
                {emailValidationClicked && (
                    <>
                        <label className="text-right font-bold" htmlFor="validationCode">
                            인증번호
                        </label>
                        <div className="flex flex-col gap-2 min-w-0">
                            <div className="flex gap-2 min-w-0">
                                <input
                                    className={`border border-slate-300 py-2 px-2 flex-1 min-w-0 h-10
                                    ${emailValidated ? "bg-gray-200" : ""}
                                    [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
                                    text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors`}
                                    type="number"
                                    placeholder="인증번호"
                                    disabled={emailValidated}
                                    name="validationCode"
                                    id="validationCode"
                                    required
                                />

                                <Button
                                    type="button"
                                    className="shrink-0 bg-mauve-500 rounded-none h-10"
                                    disabled={emailValidated}
                                >
                                    인증하기
                                </Button>

                                <Button
                                    className="shrink-0 bg-mauve-300 text-slate-700 rounded-none h-10"
                                    disabled={emailValidated}
                                >
                                    재전송
                                </Button>
                            </div>
                            <p
                                className={`text-sm text-right ${emailValidated
                                    ? "text-green-600"
                                    : "text-red-500"
                                    }`}
                            >
                                {emailValidated
                                    ? "이메일 인증이 완료되었습니다."
                                    : `남은 시간 : ${remainTime}`}
                            </p>
                        </div>
                    </>
                )}
                <label className="text-right font-bold" htmlFor="password">
                    PW
                </label>
                <input
                    className="border border-slate-300 py-2 px-2 min-w-0  h-10 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors"
                    type="password"
                    placeholder="비밀번호"
                    name="password"
                    id="password"
                    required
                />
                <label className="text-right font-bold" htmlFor="passwordCheck">
                    PW 확인
                </label>
                <input
                    className="border border-slate-300 py-2 px-2 min-w-0 h-10 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors"
                    type="password"
                    placeholder="비밀번호 확인"
                    name="passwordCheck"
                    id="passwordCheck"
                    required
                />
                {isTeacher && (
                    <>
                        <label className="text-right font-bold" htmlFor="category">
                            희망 강의 분야
                        </label>
                        <select
                            className="border border-slate-300 py-2 px-2 h-10 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors"
                            name="category" id='category'
                        >
                            <option value="study">학문</option>
                            <option value="art">예체능</option>
                            <option value="health">헬스케어</option>
                            <option value="beauty">뷰티</option>
                            <option value="cook">요리</option>
                        </select>
                        <label className="text-right font-bold" htmlFor="proof">
                            강사 인증 자료
                        </label>
                        <input
                            type="file" id='proof' name='proof'
                            className="border border-slate-300 py-2 px-3 h-10 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors"
                        />
                    </>
                )}
                <Button className="col-span-2 w-full py-6 mt-2 bg-mauve-500 rounded-none">
                    <p className="font-bold text-[17px]">회원가입</p>
                </Button>
            </form>
        </>
    )
}