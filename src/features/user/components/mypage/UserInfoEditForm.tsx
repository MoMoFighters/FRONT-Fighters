'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MomoUserInfoResponse, editMyInfo, checkAndRegisterNickname, EditMyInfoInput } from "@/features/user/action";
import { toast } from "sonner";
import UserProfileChoice from "./UserProfileChoice";

interface UserInfoEditFormProps {
    initialData: MomoUserInfoResponse | null;
    onPreviewChange?: (data: Partial<{
        nickname: string;
        profileImageUrl: string;
    }>) => void;
}

export default function UserInfoEditForm({
    initialData,
    onPreviewChange,
}: UserInfoEditFormProps) {
    const router = useRouter();
    const profile = initialData?.data;

    // 부모에게 받은 기본값으로 초기 상태 세팅
    const [name, setName] = useState(profile?.name || "");
    const [nickname, setNickname] = useState(profile?.nickname || "");
    const [email] = useState(profile?.email || "");
    const [profileUrl, setProfileUrl] = useState(profile?.profileImageUrl || "");

    // 프사 변경 모달 관련
    const [profileChangeOpen, setProfileChangeOpen] = useState(false);
    const [selectedProfileItemName, setSelectedProfileItemName] =
        useState<string | null>(null);

    // 제출 막는것 관련
    const [isNicknameChecked, setIsNicknameChecked] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 제출 막기 상태
    const isProfileUnchanged =
        selectedProfileItemName === null;

    const isUnchanged =
        nickname === (profile?.nickname || "") &&
        isProfileUnchanged;

    // input 스타일
    const inputStyle =
        "border border-slate-300 py-2 px-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors w-80 h-10";

    // 닉네임 중복검사 액션
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
        } catch {
            toast("닉네임 중복확인 중 오류가 발생했습니다.");
        }
    };

    const handleProfileItemSelect = (
        nextProfileUrl: string,
        nextImageName: string
    ) => {
        const trimmedNextImageName = nextImageName.trim();

        setProfileUrl(nextProfileUrl);
        setSelectedProfileItemName(
            trimmedNextImageName.length > 0
                ? trimmedNextImageName
                : null
        );
        onPreviewChange?.({
            profileImageUrl: nextProfileUrl,
        });
        setProfileChangeOpen(false);
    };

    // 정보 수정 눌렀을때
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (nickname !== profile?.nickname && !isNicknameChecked) {
            toast.error("닉네임 중복확인을 진행해주세요.", {
                duration: 1000
            });
            return;
        }

        try {
            setIsSubmitting(true);
            const trimmedImageName = selectedProfileItemName?.trim();
            const trimmedNickname = nickname.trim();
            const profileImagePayload =
                trimmedImageName || undefined;

            if (
                !isProfileUnchanged &&
                !profileImagePayload
            ) {
                toast.error("선택한 프로필 정보를 다시 확인해주세요.");
                return;
            }

            const editPayload: EditMyInfoInput = {};

            if (profileImagePayload) {
                editPayload.itemName = profileImagePayload;
            }

            if (trimmedNickname !== (profile?.nickname || "") && trimmedNickname) {
                editPayload.nickname = trimmedNickname;
            }

            // 서버 액션 호출
            const res = await editMyInfo(editPayload);

            if (res.status >= 200 && res.status < 300) {
                // 🔄 브라우저 캐시 갱신 및 마이페이지로 복귀 처리
                router.refresh();
                router.push("/student/mypage");
                toast.success("회원 정보가 성공적으로 수정되었습니다.");
            } else {
                toast.error(res.message || "정보 수정에 실패했습니다.");
            }
        } catch {
            toast("서버 통신 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="flex w-full flex-col gap-6">
            {/* 프로필 이미지 */}
            <div className="flex items-start gap-8 mb-4">
                <p className="w-24 font-semibold text-slate-800 pt-1.5 text-right">
                    프로필
                </p>
                <div className="relative w-28 h-28">
                    <div className="h-full w-full border border-black"
                        onClick={!profileChangeOpen ? () => setProfileChangeOpen(true) : () => { }}>
                        {profileUrl &&

                            <Image
                                src={profileUrl}
                                alt='프로필'
                                fill
                                className="object-cover rounded-md border border-slate-300"

                            />
                        }
                    </div>
                    <UserProfileChoice
                        profileChangeOpen={profileChangeOpen}
                        setProfileChangeOpen={setProfileChangeOpen}
                        onSelectProfileImage={handleProfileItemSelect}
                    />
                </div>
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
                            onPreviewChange?.({
                                nickname: inputValue,
                            });
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

            {/* submit */}
            <div className="mt-[-5px] flex w-[544px] justify-end">
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
