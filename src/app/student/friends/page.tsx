import FriendNav from "@/features/phone/components/friend/FriendNav";
import FriendList from "@/features/phone/components/friend/FriendList";
import FriendDetail from "@/features/phone/components/friend/FriendDetail";
import RequestList from "@/features/phone/components/friend/RequestList";
import FriendSearchList from "@/features/phone/components/friend/FriendSearchList";
import MyProfileDropdown from "@/features/phone/components/friend/MyProfileDropdown";

import ChatRoomArea from "@/components/common/ChatRoomArea";
import ChatRoomListPanel from "@/components/common/ChatRoomListPanel";

import { getChatRoomsService } from "@/app/services/phone/chat/service";

import {
    getFriendsService,
    getReceivedFriendRequestsService,
    getSentFriendRequestsService,
} from "@/app/services/phone/friend/service";

import { getMyInfo, MomoUserInfoResponse } from "@/features/user/action";
import { getNoticeNotificationListAction } from "@/features/user/components/notification/action";
import type { ApiResponse } from "@/lib/api";
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

    // 실제로 렌더링되는 건 활성 탭 하나뿐이라, 다른 탭이 쓸 데이터까지 매번 다 받아올 필요는 없음.
    // chatRoomData는 "친구" 탭의 내 프로필 드롭다운(myChatRoom)에서도 쓰이므로 friend/chat 둘 다 필요.
    const needsFriendTabData = currentStatus === "friend";
    const needsRequestTabData = currentStatus === "request";
    const needsChatRoomData = currentStatus === "friend" || currentStatus === "chat";

    const emptyListResponse = <T,>(): ApiResponse<T[]> => ({
        timestamp: new Date().toISOString(),
        status: 204,
        code: "SKIPPED",
        message: "",
        data: [],
    });

    const [
        myInfo,
        roomResponse,
        friendsResponse,
        receivedResponse,
        sentResponse,
        notificationListResponse,
    ]: [
            MomoUserInfoResponse,
            Awaited<ReturnType<typeof getChatRoomsService>>,
            Awaited<ReturnType<typeof getFriendsService>>,
            Awaited<ReturnType<typeof getReceivedFriendRequestsService>>,
            Awaited<ReturnType<typeof getSentFriendRequestsService>>,
            Awaited<ReturnType<typeof getNoticeNotificationListAction>>,
        ] = await Promise.all([
            needsFriendTabData ? getMyInfo() : Promise.resolve({ timestamp: new Date().toISOString(), status: 204, code: "SKIPPED", message: "" } as MomoUserInfoResponse),
            needsChatRoomData
                ? getChatRoomsService(accessToken)
                : Promise.resolve(emptyListResponse() as Awaited<ReturnType<typeof getChatRoomsService>>),
            needsFriendTabData
                ? getFriendsService(accessToken)
                : Promise.resolve(emptyListResponse() as Awaited<ReturnType<typeof getFriendsService>>),
            needsRequestTabData
                ? getReceivedFriendRequestsService(accessToken)
                : Promise.resolve(emptyListResponse() as Awaited<ReturnType<typeof getReceivedFriendRequestsService>>),
            needsRequestTabData
                ? getSentFriendRequestsService(accessToken)
                : Promise.resolve(emptyListResponse() as Awaited<ReturnType<typeof getSentFriendRequestsService>>),
            getNoticeNotificationListAction(),
        ]);

    const chatRoomData = roomResponse.status === 200 ? roomResponse.data ?? [] : [];
    const friends = friendsResponse.status === 200 ? friendsResponse.data ?? [] : [];
    const received = receivedResponse.status === 200 ? receivedResponse.data ?? [] : [];
    const sent = sentResponse.status === 200 ? sentResponse.data ?? [] : [];
    const notifications = notificationListResponse.data ?? [];
    const hasUnreadFriendRequest = notifications.some(
        (notification) => notification.type === "FRIEND_REQUEST" && !notification.isRead
    );
    const hasUnreadChatMessage = notifications.some(
        (notification) => notification.type === "MESSAGE" && !notification.isRead
    );

    const myChatRoom =
        chatRoomData.length > 0
            ? chatRoomData.reduce((smallestRoom, room) =>
                room.roomId < smallestRoom.roomId ? room : smallestRoom
            )
            : undefined;
    const selectedFriend =
        friends.find(friend => friend.userId === currentFriendId) ?? null;

    return (
        <div className="mx-3 flex h-[calc(100vh-134px)] max-h-[calc(100vh-134px)] min-h-0 flex-row overflow-hidden   bg-white">
            <FriendNav
                status={currentStatus}
                hasUnreadRequest={hasUnreadFriendRequest}
                hasUnreadChat={hasUnreadChatMessage}
            />

            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                {currentStatus === "friend" && (
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
                )}

                {currentStatus === "request" && (
                    <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-2">
                        <RequestList received={received} sent={sent} />
                        <FriendSearchList />
                    </div>
                )}

                {currentStatus === "chat" && (
                    <div className="grid h-full max-h-full min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-[3fr_7fr]">
                        <div className="flex min-h-0 flex-col overflow-hidden border-r border-slate-200 bg-white">
                            <div className="hidden">
                                <p className="font-bold text-slate-900">
                                    채팅 목록
                                </p>
                            </div>

                            <ChatRoomListPanel
                                accessToken={accessToken}
                                initialRooms={chatRoomData}
                            />
                        </div>

                        <div className="min-h-0 min-w-0 overflow-hidden bg-white">
                            <ChatRoomArea
                                currentRoomId={currentRoomId}
                                accessToken={accessToken}
                                isMine={currentRoomId === myChatRoom?.roomId}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
