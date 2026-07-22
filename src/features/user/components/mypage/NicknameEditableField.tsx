"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PencilLine } from "lucide-react";
import { toast } from "sonner";
import { editMyInfo } from "@/features/user/action";
import MembershipBadge from "@/components/common/MembershipBadge";

interface NicknameEditableFieldProps {
    nickname: string;
    membership?: "BASIC" | "PLUS" | "PRO";
    membershipUntil?: string | null;
}

export default function NicknameEditableField({
    nickname,
    membership,
    membershipUntil,
}: NicknameEditableFieldProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(nickname);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const startEdit = () => {
        setValue(nickname);
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setValue(nickname);
        setIsEditing(false);
    };

    const handleSubmit = async () => {
        const trimmed = value.trim();

        if (!trimmed) {
            toast.error("닉네임을 입력해주세요.");
            return;
        }

        if (trimmed === nickname) {
            setIsEditing(false);
            return;
        }

        try {
            setIsSubmitting(true);
            const res = await editMyInfo({ nickname: trimmed });

            if (res.status >= 200 && res.status < 300) {
                toast.success("닉네임이 변경되었습니다.");
                setIsEditing(false);
                router.refresh();
            } else {
                toast.error(res.message || "닉네임 변경에 실패했습니다.");
            }
        } catch {
            toast.error("서버 통신 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isEditing) {
        return (
            <div className="flex min-w-0 flex-1 items-center gap-1">
                <input
                    autoFocus
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSubmit();
                        if (e.key === "Escape") cancelEdit();
                    }}
                    disabled={isSubmitting}
                    className="min-w-0 flex-1 rounded-md border border-slate-300 px-1.5 py-0.5 text-[11px] font-black text-slate-900 focus:border-indigo-400 focus:outline-none disabled:opacity-60"
                />
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="shrink-0 rounded-md bg-indigo-500 px-1.5 py-0.5 text-[9px] font-black text-white transition hover:bg-indigo-600 disabled:opacity-60"
                >
                    변경
                </button>
                <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={isSubmitting}
                    className="shrink-0 rounded-md border border-slate-200 px-1.5 py-0.5 text-[9px] font-black text-slate-500 transition hover:bg-slate-50 disabled:opacity-60"
                >
                    취소
                </button>
            </div>
        );
    }

    return (
        <div className="flex min-w-0 items-center gap-1">
            <p className="truncate text-md font-black text-slate-900">{nickname}</p>
            <button
                type="button"
                onClick={startEdit}
                aria-label="닉네임 수정"
                className="shrink-0 text-slate-300 transition hover:text-indigo-500"
            >
                <PencilLine className="h-3 w-3" />
            </button>
            <MembershipBadge
                membership={membership}
                membershipUntil={membershipUntil}
                className="shrink-0 rounded-md px-1 py-0.5 text-[9px]"
            />
        </div>
    );
}
