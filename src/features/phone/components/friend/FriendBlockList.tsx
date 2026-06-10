import FriendItem from "@/components/phone/friends/FriendItem";
import { BlockedFriendData } from "@/app/services/phone/chat/service";

interface FriendBlockListProps {
    blockedFriends: BlockedFriendData[];
}

export default function FriendBlockList({ blockedFriends }: FriendBlockListProps) {
    return (
        <section className="flex min-h-0 flex-col bg-slate-50">
            <div className="border-b border-slate-200 bg-white px-5 py-3">
                <p className="font-semibold text-slate-900">
                    차단관리
                </p>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-5 scrollbar-none">
                {blockedFriends.length > 0 ? (
                    blockedFriends.map(friend => (
                        <FriendItem
                            key={friend.userId}
                            friendInfo={{
                                userId: friend.userId,
                                name: friend.nickname,
                                status: friend.status,
                                profile: friend.profileImageUrl ?? "",
                            }}
                        />
                    ))
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <p className="font-medium text-slate-500">
                            차단한 친구가 없습니다.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}