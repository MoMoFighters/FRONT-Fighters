import Image from "next/image";

import FriendList from "@/features/phone/components/friend/FriendList";
import FriendDetail from "@/features/phone/components/friend/FriendDetail";
import MyProfileDropdown from "@/features/phone/components/friend/MyProfileDropdown";

import { getChatRoomsService } from "@/app/services/phone/chat/service";
import { getFriendsService } from "@/app/services/phone/friend/service";
import { getMyInfo } from "@/features/user/action";

interface FriendTabSectionProps {
    accessToken: string;
    currentFriendId: number | null;
}

export default async function FriendTabSection({
    accessToken,
    currentFriendId,
}: FriendTabSectionProps) {
    const [myInfo, friendsResponse, roomResponse] = await Promise.all([
        getMyInfo(),
        getFriendsService(accessToken),
        getChatRoomsService(accessToken),
    ]);

    const friends = friendsResponse.status === 200 ? friendsResponse.data ?? [] : [];
    const chatRoomData = roomResponse.status === 200 ? roomResponse.data ?? [] : [];

    const myChatRoom =
        chatRoomData.length > 0
            ? chatRoomData.reduce((smallestRoom, room) =>
                room.roomId < smallestRoom.roomId ? room : smallestRoom
            )
            : undefined;
    const selectedFriend =
        friends.find(friend => friend.userId === currentFriendId) ?? null;

    return (
        <div className="min-h-0 flex-1 grid grid-cols-1 overflow-hidden md:grid-cols-[3fr_7fr]">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden border-r border-slate-200 bg-white">
                <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
                    <Image
                        src={myInfo.data?.profileImageUrl || ""}
                        alt="프로필"
                        className="h-12 w-12 rounded-full object-cover"
                        width={48}
                        height={48}
                    />

                    <div className="flex min-w-0 flex-1 flex-col">
                        <p className="truncate font-bold text-slate-800">
                            {myInfo.data?.nickname}
                        </p>
                        <p className="text-sm text-slate-400">
                            내 프로필
                        </p>
                    </div>

                    <MyProfileDropdown myChatRoomId={myChatRoom?.roomId} />
                </div>
                <FriendList
                    friends={friends}
                    selectedFriendId={currentFriendId}
                />

            </div>
            <FriendDetail friend={selectedFriend} />
        </div>
    );
}
