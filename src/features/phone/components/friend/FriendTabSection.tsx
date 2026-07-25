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

    // 모바일(lg 미만)에서는 목록/상세를 동시에 쌓아 보여주지 않고, 친구를 선택하면(friendId 존재)
    // 상세 화면이 목록을 완전히 덮어쓰도록 하나만 보이게 전환한다. lg 이상에서는 항상 둘 다 보인다.
    const showListOnMobile = !selectedFriend;

    return (
        <div className="min-h-0 flex-1 grid grid-cols-1 overflow-hidden lg:grid-cols-[3fr_7fr]">
            <div
                className={`min-h-0 flex-1 flex-col overflow-hidden border-r border-slate-200 bg-white lg:flex ${showListOnMobile ? "flex" : "hidden"
                    }`}
            >
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
            <div
                className={`min-h-0 flex-col overflow-hidden lg:flex ${showListOnMobile ? "hidden" : "flex"
                    }`}
            >
                <FriendDetail friend={selectedFriend} />
            </div>
        </div>
    );
}
