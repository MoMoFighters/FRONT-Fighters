import FriendItem from "@/components/phone/friends/FriendItem";

interface FriendRequestInfo {
    userId: number;
    nickname: string;
    status: "SENT" | "RECEIVED" | "BLOCK" | "NONE" | "FRIEND";
    profileImageUrl: string;
}

interface RequestListProps {
    received: FriendRequestInfo[];
    sent: FriendRequestInfo[];
}

export default function RequestList({
    received,
    sent,
}: RequestListProps) {
    return (
        <section className="flex min-h-0 flex-col border-r border-slate-200 bg-slate-50">
            <div className="border-b border-slate-200 bg-white px-5 py-3">
                <p className="font-bold text-slate-900">
                    요청 확인
                </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5 scrollbar-none">
                <div className="flex flex-col gap-3">
                    <p className="text-sm font-bold text-slate-700">
                        받은 요청
                    </p>

                    {received.length > 0 ? (
                        received.map(friend => (
                            <FriendItem
                                key={friend.userId}
                                friendInfo={{
                                    userId: friend.userId,
                                    name: friend.nickname,
                                    status: "RECEIVED",
                                    profile: friend.profileImageUrl,
                                }}
                            />
                        ))
                    ) : (
                        <p className="py-3 text-sm font-medium text-slate-500">
                            받은 요청이 없습니다.
                        </p>
                    )}
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5">
                    <p className="text-sm font-bold text-slate-700">
                        보낸 요청
                    </p>

                    {sent.length > 0 ? (
                        sent.map(friend => (
                            <FriendItem
                                key={friend.userId}
                                friendInfo={{
                                    userId: friend.userId,
                                    name: friend.nickname,
                                    status: "SENT",
                                    profile: friend.profileImageUrl,
                                }}
                            />
                        ))
                    ) : (
                        <p className="py-3 text-sm font-medium text-slate-500">
                            보낸 요청이 없습니다.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}