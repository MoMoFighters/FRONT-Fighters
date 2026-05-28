'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import MovePageBackBtn from "@/components/common/MovePageBackBtn";

import {
    Eye,
    EyeOff,
} from "lucide-react";
import Image from "next/image";

export default function MyPageEdit() {

    const [name, setName] = useState("");
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [profileUrl, setProfileUrl] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const passwordSame = passwordConfirm === "" ? true : password === passwordConfirm;

    const inputStyle =
        "border border-slate-300 py-2 px-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors w-80 h-10";

    // 데이터 패칭 받아서 그 값 기본 값으로 넣어주기
    useEffect(() => {
        setName('');
        setNickname('');
        setEmail('');
        setProfileUrl('');
    }, [])

    return (
        <div className="p-12 relative">

            <MovePageBackBtn href="/student/mypage" />

            {/* title */}
            <p className="mb-8 font-bold text-slate-900 text-2xl">
                내 정보 수정
            </p>

            {/* profile 
                나중에 프로필 기능 생기면 온클릭 걸어서 프사 바꿀수 있는 기능 추가
            */}
            <div className="flex items-start gap-8 mb-10">
                <p className="w-24 font-semibold text-slate-800 pt-1.5 text-right">
                    프로필
                </p>
                {profileUrl ? (
                    <Image src={profileUrl} alt='프로필'></Image>
                ) : (
                    <div className="w-28 h-28 border border-slate-300 bg-slate-100 rounded-md" />
                )}

            </div>

            {/* form */}
            <form className="flex flex-col gap-6 max-w-2xl">

                {/* 이름 */}
                <div className="flex items-center gap-8">
                    <label
                        htmlFor="name"
                        className="w-24 font-semibold text-slate-800 text-right"
                    >
                        이름
                    </label>
                    <input
                        type="text"
                        id="name"
                        placeholder="이름 입력"
                        className={inputStyle}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* 닉네임 */}
                <div className="flex items-center gap-8">
                    <label
                        htmlFor="nickname"
                        className="w-24 font-semibold text-slate-800 text-right"
                    >
                        닉네임
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            id="nickname"
                            placeholder="닉네임 입력"
                            className={inputStyle}
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                        />
                        {/* 🔗 인풋 박스와 h-10으로 높이를 칼같이 맞춘 중복확인 버튼 */}
                        <Button
                            type="button"
                            className="border border-slate-300 px-4 h-10 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-none transition-colors shadow-none"
                        >
                            중복확인
                        </Button>
                    </div>
                </div>

                {/* 생년월일 - 모듈4*/}
                {/* <div className="flex items-center gap-8">
                    <label
                        htmlFor="birth"
                        className="w-24 font-semibold text-slate-800 text-right"
                    >
                        생년월일
                    </label>
                    <input
                        type="date"
                        id="birth"
                        className={inputStyle}
                    />
                </div>
                */}

                {/* 이메일 (수정 불가 고정 영역) */}
                <div className="flex items-center gap-8">
                    <label
                        htmlFor="email"
                        className="w-24 font-semibold text-slate-800 text-right"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name='email'
                        disabled
                        value={email}
                        className="border border-slate-300 py-2 px-3 bg-slate-200 text-slate-500 w-80 h-10 disabled:opacity-100"
                    />
                </div>

                {/* 현재 비밀번호 */}
                <div className="flex items-center gap-8">
                    <label
                        htmlFor="currentPassword"
                        className="w-24 font-semibold text-slate-800 text-right"
                    >
                        현재 비밀번호
                    </label>
                    <div className="relative">
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            id="currentPassword"
                            className={`${inputStyle} pr-10`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer"
                        >
                            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* 새 비밀번호 */}
                <div className="flex items-center gap-8">
                    <label
                        htmlFor="password"
                        className="w-24 font-semibold text-slate-800 text-right"
                    >
                        새 비밀번호
                    </label>
                    <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            className={`${inputStyle} pr-10`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer"
                        >
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* 비밀번호 확인 */}
                <div className="flex items-center gap-8">
                    <label
                        htmlFor="passwordConfirm"
                        className="w-24 font-semibold text-slate-800 text-right"
                    >
                        비밀번호 확인
                    </label>
                    <div className="relative">
                        <input
                            type={showPasswordConfirm ? "text" : "password"}
                            id="passwordConfirm"
                            className={`${inputStyle} pr-10`}
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)} // 👈 여기도 값만 쏙 넣어줍니다.
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer"
                        >
                            {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>
                <div className="p-0 text-center mt-[-20] ml-7 h-5">
                    <p className="text-sm text-red-500 font-bold">
                        {!passwordSame ? "비밀번호가 일치하지 않습니다." : " "}
                    </p>
                </div>
                {/* submit */}
                <div className="flex justify-center pl-32 mt-[-5]">
                    <Button
                        type="submit"
                        className="border border-slate-400 px-8 py-6 bg-white text-slate-800 font-semibold hover:bg-slate-100 rounded-none transition-colors text-base shadow-none"
                    >
                        정보 수정
                    </Button>
                </div>

            </form>
        </div>
    );
}