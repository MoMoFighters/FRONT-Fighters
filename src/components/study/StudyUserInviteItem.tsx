import Image from "next/image";

import type { StudentFriendData } from "@/features/friend/type";

interface StudyUserInviteItemProps {
    friend: StudentFriendData;
    isInvited: boolean;
    onInvite: (friend: StudentFriendData) => void;
}

export default function StudyUserInviteItem({
    friend,
    isInvited,
    onInvite,
}: StudyUserInviteItemProps) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3">
            <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-sm font-black text-indigo-500">
                {friend.profileImageUrl ? (
                    <Image
                        src={friend.profileImageUrl}
                        alt={`${friend.nickname} 프로필`}
                        fill
                        sizes="40px"
                        className="object-cover"
                    />
                ) : (
                    friend.nickname.slice(0, 1)
                )}
            </div>

            <p className="min-w-0 flex-1 truncate text-sm font-bold text-slate-800">
                {friend.nickname}
            </p>

            <button
                type="button"
                disabled={isInvited}
                onClick={() => onInvite(friend)}
                className="shrink-0 cursor-pointer rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-black text-indigo-500 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
            >
                {isInvited ? "초대함" : "초대하기"}
            </button>
        </div>
    );
}
