"use client";

import { useState } from "react";

import MovePageBackBtn from "@/components/common/MovePageBackBtn";
import MomoResidentCardPreview from "@/components/mypage/MomoResidentCardPreview";
import { MomoUserInfoResponse } from "@/features/user/action";
import UserInfoEditForm from "@/features/user/components/mypage/UserInfoEditForm";

interface ResidentCardPreviewData {
    name: string;
    nickname: string;
    createdAt: string;
    profileImageUrl: string;
}

interface MyPageEditClientProps {
    userInfo: MomoUserInfoResponse;
    initialCardData: ResidentCardPreviewData;
}

export default function MyPageEditClient({
    userInfo,
    initialCardData,
}: MyPageEditClientProps) {
    const [cardData, setCardData] = useState(initialCardData);

    const updateCardPreview = (
        nextData: Partial<ResidentCardPreviewData>
    ) => {
        setCardData((prev) => ({
            ...prev,
            ...nextData,
        }));
    };

    return (
        <main className="w-full max-w-360 -mt-8">
            <section className="min-w-0">
                <div className="mb-8 flex items-center gap-4">
                    <MovePageBackBtn href="/student/mypage" />
                    <div>
                        <h1 className="text-2xl font-black text-slate-900">
                            내 정보 수정
                        </h1>
                        <p className="mt-1 text-sm font-bold text-slate-400">
                            닉네임과 비밀번호 및 프로필 이미지를 변경할 수 있습니다.
                        </p>
                    </div>
                </div>

                <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm px-20">
                    <div className="grid min-h-[560px] grid-cols-[minmax(0,1fr)_460px] gap-8">
                        <UserInfoEditForm
                            initialData={userInfo}
                            onPreviewChange={updateCardPreview}
                        />

                        <div className="flex justify-center border-l border-slate-100 pl-8">
                            <MomoResidentCardPreview data={cardData} />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
