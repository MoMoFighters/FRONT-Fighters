import FriendItem from "@/components/phone/friends/FriendItem";
import type { FriendData } from "@/app/services/phone/friend/service";

interface FriendListProps {
    friends: FriendData[];
    selectedFriendId: number | null;
}

export default function FriendList({
    friends,
    selectedFriendId,
}: FriendListProps) {
    const friendList = friends.filter(friend => friend.status === "FRIEND");

    return (
        <section className="flex min-h-0 flex-col bg-white">
            <div className="bg-white px-5 pb-2 pt-4">
                <p className="font-semibold text-slate-900">
                    친구 목록
                </p>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-5 scrollbar-none">
                {friendList.length > 0 ? (
                    friendList.map(friend => (
                        <FriendItem
                            key={friend.userId}
                            href={`/student/phone/friends?status=friend&friendId=${friend.userId}`}
                            selected={selectedFriendId === friend.userId}
                            showActions={false}
                            friendInfo={{
                                userId: friend.userId,
                                name: friend.name ?? friend.nickname,
                                status: friend.status,
                                profile: friend.profileImageUrl ?? "",
                            }}
                        />
                    ))
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <p className="font-medium text-slate-500">
                            친구가 없습니다.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}