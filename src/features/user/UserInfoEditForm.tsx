'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { MomoUserInfoResponse, editMyInfo, checkAndRegisterNickname } from "@/features/user/action";
import user from "@/app/assets/img/user.svg";
import { toast } from "sonner";

interface UserInfoEditFormProps {
    initialData: MomoUserInfoResponse | null;
}

export default function UserInfoEditForm({ initialData }: UserInfoEditFormProps) {
    const router = useRouter();
    const profile = initialData?.data;

    // 부모에게 받은 기본값으로 초기 상태 세팅
    const [name, setName] = useState(profile?.name || "");
    const [nickname, setNickname] = useState(profile?.nickname || "");
    const [email] = useState(profile?.email || "");
    const [profileUrl, setProfileUrl] = useState(profile?.profileImageUrl || "");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [isNicknameChecked, setIsNicknameChecked] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const passwordSame = passwordConfirm === "" ? true : password === passwordConfirm;
    const passwordInvalid = (currentPassword === "" && password !== "") || (currentPassword !== "" && password === "");

    const isUnchanged =
        nickname === (profile?.nickname || "") &&
        currentPassword === "" &&
        password === "" &&
        passwordConfirm === "";

    const inputStyle =
        "border border-slate-300 py-2 px-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors w-80 h-10";

    const handleNicknameCheck = async () => {
        if (!nickname || nickname.trim().length === 0) {
            toast("닉네임을 입력해주세요.");
            return;
        }
        if (nickname === profile?.nickname) {
            return;
        }

        try {
            const res = await checkAndRegisterNickname(nickname);
            if (res.status === 200) {
                toast.success(res.message || "사용 가능한 닉네임입니다.");
                setIsNicknameChecked(true);
            } else {
                toast.error(res.message || "이미 사용 중인 닉네임입니다!!!.");
                setIsNicknameChecked(false);
            }
        } catch (error) {
            toast("닉네임 중복확인 중 오류가 발생했습니다.");
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (nickname !== profile?.nickname && !isNicknameChecked) {
            toast.error("닉네임 중복확인을 진행해주세요.", {
                duration: 1000
            });
            return;
        }

        if (!passwordSame) {
            toast.error("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        if (passwordInvalid) {
            toast.error("비밀번호 변경시 현재 비밀번호를 입력해주세요.");
            return;
        }

        try {
            setIsSubmitting(true);

            // 서버 액션 호출
            const res = await editMyInfo({
                nickname: nickname === profile?.nickname ? undefined : nickname,
                currentPassword: currentPassword || undefined,
                password: password || undefined,
            });


            if (res.success) {

                // 비밀번호 입력 폼 초기화
                setCurrentPassword("");
                setPassword("");
                setPasswordConfirm("");

                // 🔄 브라우저 캐시 갱신 및 마이페이지로 복귀 혹은 새로고침 처리
                router.refresh();
                if (!currentPassword) {
                    router.push("/student/mypage");
                    toast.success("회원 정보가 성공적으로 수정되었습니다.");
                } else {
                    router.push("/auth/login");
                    toast("비밀번호가 변경되었으니 다시 로그인해주세요.");
                }
            } else {
                toast(res.message || "정보 수정에 실패했습니다.");
            }
        } catch (error) {
            toast("서버 통신 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-2xl">
            {/* 프로필 이미지 */}
            <div className="flex items-start gap-8 mb-4">
                <p className="w-24 font-semibold text-slate-800 pt-1.5 text-right">
                    프로필
                </p>
                {profileUrl ? (
                    <div className="relative w-28 h-28">
                        <Image
                            src={profileUrl || user}
                            alt='프로필'
                            fill
                            className="object-cover rounded-md border border-slate-300"
                        />
                    </div>
                ) : (
                    <div className="w-28 h-28 border border-slate-300 bg-slate-100 rounded-md" />
                )}
            </div>

            {/* 이름 */}
            <div className="flex items-center gap-8">
                <label htmlFor="name" className="w-24 font-semibold text-slate-800 text-right">
                    이름
                </label>
                <input
                    type="text"
                    id="name"
                    placeholder="이름 입력"
                    disabled
                    className="border border-slate-300 py-2 px-3 bg-slate-200 text-slate-500 w-80 h-10 disabled:opacity-100"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            {/* 닉네임 */}
            <div className="flex items-center gap-8">
                <label htmlFor="nickname" className="w-24 font-semibold text-slate-800 text-right">
                    닉네임
                </label>
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        id="nickname"
                        placeholder="닉네임 입력"
                        className={inputStyle}
                        value={nickname}
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            setNickname(inputValue);
                            if (initialData?.data?.nickname === inputValue) {
                                setIsNicknameChecked(true);
                            } else {
                                setIsNicknameChecked(false);
                            }
                        }}
                    />
                    <Button
                        type="button"
                        onClick={handleNicknameCheck}
                        className="border border-slate-300 px-4 h-10 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-none transition-colors shadow-none"
                        disabled={nickname === profile?.nickname}
                    >
                        중복확인
                    </Button>
                </div>
            </div>

            {/* 이메일 (수정 불가 고정 영역) */}
            <div className="flex items-center gap-8">
                <label htmlFor="email" className="w-24 font-semibold text-slate-800 text-right">
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
                <label htmlFor="currentPassword" className="w-24 font-semibold text-slate-800 text-right">
                    현재 비밀번호
                </label>
                <div className="relative">
                    <input
                        type={showCurrentPassword ? "text" : "password"}
                        id="currentPassword"
                        className={`${inputStyle} pr-10`}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
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
                <label htmlFor="password" className="w-24 font-semibold text-slate-800 text-right">
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
                <label htmlFor="passwordConfirm" className="w-24 font-semibold text-slate-800 text-right">
                    비밀번호 확인
                </label>
                <div className="relative">
                    <input
                        type={showPasswordConfirm ? "text" : "password"}
                        id="passwordConfirm"
                        className={`${inputStyle} pr-10`}
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
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

            {/* 비밀번호 불일치 경고 */}
            <div className="p-0 text-left mt-[-15px] ml-32 h-5">
                <p className="text-sm text-red-500 font-bold">
                    {!passwordSame ? "비밀번호가 일치하지 않습니다." : " "}
                </p>
            </div>

            {/* submit */}
            <div className="flex justify-center pl-32 mt-[-5px]">
                <Button
                    type="button"
                    disabled={isUnchanged}
                    className="border border-slate-400 px-8 py-6 bg-white text-slate-800 font-semibold hover:bg-slate-100 rounded-none transition-colors text-base shadow-none disabled:bg-slate-100"
                    onClick={handleSubmit}
                >
                    {isSubmitting ? "수정 중..." : "정보 수정"}
                </Button>
            </div>
        </div >
    );
}
