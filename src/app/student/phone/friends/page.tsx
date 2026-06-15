import FriendNav from "@/features/phone/components/friend/FriendNav";
import FriendList from "@/features/phone/components/friend/FriendList";
import FriendDetail from "@/features/phone/components/friend/FriendDetail";
import RequestList from "@/features/phone/components/friend/RequestList";
import FriendSearchList from "@/features/phone/components/friend/FriendSearchList";
import MyProfileDropdown from "@/features/phone/components/friend/MyProfileDropdown";

import ChatRoomArea from "@/components/common/ChatRoomArea";
import ChatRoomItem from "@/components/common/ChatRoomItem";

import { getChatRoomsService } from "@/app/services/phone/chat/service";

import {
    getFriendsService,
    getReceivedFriendRequestsService,
    getSentFriendRequestsService,
} from "@/app/services/phone/friend/service";

import { getMyInfo, MomoUserInfoResponse } from "@/features/user/action";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";

type CurrentStatus = "friend" | "request" | "chat";

export default async function StudentChatPage({
    searchParams,
}: {
    searchParams: Promise<{
        status?: string;
        roomId?: string;
        friendId?: string;
    }>;
}) {
    const { status, roomId, friendId } = await searchParams;

    const currentStatus = (
        status === "request" || status === "chat" || status === "friend"
            ? status
            : "friend"
    ) as CurrentStatus;

    const currentRoomId = roomId ? Number(roomId) : null;
    const currentFriendId = friendId ? Number(friendId) : null;

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        redirect("/auth/login");
    }

    const myInfo: MomoUserInfoResponse = await getMyInfo();

    const roomResponse = await getChatRoomsService(accessToken);
    const chatRoomData = roomResponse.status === 200 ? roomResponse.data ?? [] : [];

    const friendsResponse = await getFriendsService(accessToken);
    const friends = friendsResponse.status === 200 ? friendsResponse.data ?? [] : [];

    const receivedResponse = await getReceivedFriendRequestsService(accessToken);
    const received = receivedResponse.status === 200 ? receivedResponse.data ?? [] : [];

    const sentResponse = await getSentFriendRequestsService(accessToken);
    const sent = sentResponse.status === 200 ? sentResponse.data ?? [] : [];

    const myChatRoom = chatRoomData[0];
    const otherChatRooms = chatRoomData.slice(1);

    const selectedFriend =
        friends.find(friend => friend.userId === currentFriendId) ?? null;

    return (
        <div className="mx-3 flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <FriendNav status={currentStatus} />

            {currentStatus === "friend" && (
                <div className="min-h-0 flex-1 grid grid-cols-[4fr_6fr] overflow-hidden">

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
                                <p className="truncate font-semibold text-slate-800">
                                    {myInfo.data?.nickname}
                                </p>
                                <p className="text-sm text-slate-400">
                                    내 프로필
                                </p>
                            </div>

                            <MyProfileDropdown myChatRoomId={myChatRoom?.roomInfo.roomId} />
                        </div>
                        <FriendList
                            friends={friends}
                            selectedFriendId={currentFriendId}
                        />

                    </div>
                    <FriendDetail friend={selectedFriend} />
                </div>
            )}

            {currentStatus === "request" && (
                <div className="grid min-h-0 flex-1 grid-cols-2 overflow-hidden">
                    <RequestList received={received} sent={sent} />
                    <FriendSearchList />
                </div>
            )}

            {currentStatus === "chat" && (
                <div className="flex min-h-0 flex-1 overflow-hidden">
                    <div className="flex w-80 shrink-0 flex-col border-r border-slate-200 bg-white">
                        <div className="border-b border-slate-100 px-4 py-3">
                            <p className="font-semibold text-slate-900">
                                채팅 목록
                            </p>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-none">
                            {myChatRoom && (
                                <ChatRoomItem data={myChatRoom} />
                            )}

                            {otherChatRooms.length > 0 ? (
                                otherChatRooms.map(room => (
                                    <ChatRoomItem
                                        key={room.roomInfo.roomId}
                                        data={room}
                                    />
                                ))
                            ) : (
                                <div className="flex h-full items-center justify-center p-5 text-center text-sm text-slate-400">
                                    채팅방이 존재하지 않습니다.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="min-w-0 flex-1 bg-white">
                        <ChatRoomArea
                            currentRoomId={currentRoomId}
                            accessToken={accessToken}
                            isMine={currentRoomId === myChatRoom?.roomInfo.roomId}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
