"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UserRound } from "lucide-react";
import { toast } from "sonner";

import { editMyInfo } from "@/features/user/action";
import UserProfileChoice from "./UserProfileChoice";

interface MyPageProfileAvatarProps {
    profileImageUrl: string;
}

export default function MyPageProfileAvatar({
    profileImageUrl,
}: MyPageProfileAvatarProps) {
    const router = useRouter();
    const [profileChangeOpen, setProfileChangeOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSelectProfileImage = async (
        _imageUrl: string,
        itemName: string
    ) => {
        const trimmedItemName = itemName.trim();

        setProfileChangeOpen(false);

        if (!trimmedItemName || isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await editMyInfo({ itemName: trimmedItemName });

            if (response.status >= 200 && response.status < 300) {
                toast.success("프로필 이미지가 변경되었습니다.");
                router.refresh();
            } else {
                toast.error(response.message || "프로필 이미지 변경에 실패했습니다.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative h-12 w-12 shrink-0">
            <button
                type="button"
                onClick={() => setProfileChangeOpen((prev) => !prev)}
                disabled={isSubmitting}
                aria-label="프로필 이미지 변경"
                className="relative flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-slate-400 ring-1 ring-slate-200 transition hover:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {profileImageUrl ? (
                    <Image
                        src={profileImageUrl}
                        alt="프로필 이미지"
                        fill
                        sizes="64px"
                        className="object-cover"
                    />
                ) : (
                    <UserRound className="h-8 w-8" />
                )}
            </button>

            <UserProfileChoice
                profileChangeOpen={profileChangeOpen}
                setProfileChangeOpen={setProfileChangeOpen}
                onSelectProfileImage={handleSelectProfileImage}
            />
        </div>
    );
}
