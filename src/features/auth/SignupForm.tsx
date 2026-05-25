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
            <h1 className="text-center text-2xl font-bold">{isTeacher ? "회원가입(강사)" : "회원가입(수강생)"}</h1>
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
            <form action="" className="flex flex-col gap-2">
                <div className="grid grid-cols-[1fr_3fr]">
                    <input type="hidden" name='role' defaultValue={isTeacher ? "teacher" : "student"} />
                    <p className='text-right font-bold mr-2 my-auto'>이름</p>
                    <input className='border border-black py-2 pl-2' type="text" placeholder="이름" name='name' required />
                </div>
                <div className="grid grid-cols-[1fr_3fr]">
                    <p className='text-right font-bold mr-2 my-auto'>이메일</p>
                    <div className="flex flex-row">
                        <input className='border border-black py-2 pl-2' type="email" placeholder="이메일" name='email' required />
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
                                />
                                <Button type="button" className="mx-1 my-auto" disabled={emailValidated}>인증하기</Button>
                                <Button type="button" className="my-auto" disabled={emailValidated}>코드 재전송</Button>
                            </div>
                        </div>
                        <p className={emailValidatedTextStyle}>
                            {emailValidated ? "이메일 인증이 완료되었습니다." : `남은 시간 : ${remainTime}`}
                        </p>
                    </div>
                ) : ("")}
                <div className="grid grid-cols-[1fr_3fr]">
                    <p className='text-right font-bold mr-2 my-auto'>PW</p>
                    <input className='border border-black py-2 pl-2' type="password" placeholder="비밀번호" name='password' required />
                </div>
                <div className="grid grid-cols-[1fr_3fr]">
                    <p className='text-right font-bold mr-2 my-auto'>PW 확인</p>
                    <input className='border border-black py-2 pl-2' type="password" placeholder="비밀번호확인" name="passwordCheck" required />
                </div>
                {isTeacher ? (
                    <>
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
                        <div className="grid grid-cols-[1fr_3fr]">
                            <p className="text-right font-bold mr-2 my-auto">강사 인증 자료</p>
                            <div className="border border-black w-auto h-10">
                                <input type="file" className="cursor-pointer align-middle px-2" />
                            </div>
                        </div>
                    </>
                ) : ("")}
                <Button className="py-5 px-2 mx-30">회원가입</Button>
            </form>
        </>
    )
}