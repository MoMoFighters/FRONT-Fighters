import { Suspense } from "react";

import FriendNav from "@/features/phone/components/friend/FriendNav";
import FriendTabSection from "@/features/phone/components/friend/FriendTabSection";
import RequestTabSection from "@/features/phone/components/friend/RequestTabSection";
import ChatTabSection from "@/features/phone/components/friend/ChatTabSection";
import {
    FriendTabSkeleton,
    RequestTabSkeleton,
    ChatTabSkeleton,
} from "@/features/phone/components/friend/FriendTabSkeletons";

import { getNoticeNotificationListAction } from "@/features/user/components/notification/action";
import { isFriendAcceptedNotification } from "@/features/user/components/notification/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

    const notificationListResponse = await getNoticeNotificationListAction();
    const notifications = notificationListResponse.data ?? [];
    const hasUnreadFriendRequest = notifications.some(
        (notification) =>
            notification.type === "FRIEND_REQUEST" &&
            !notification.isRead &&
            !isFriendAcceptedNotification(notification)
    );
    const hasUnreadChatMessage = notifications.some(
        (notification) => notification.type === "MESSAGE" && !notification.isRead
    );

    return (
        <div className="flex h-[calc(100vh-134px)] max-h-[calc(100vh-134px)] min-h-0 w-full flex-col overflow-hidden p-4 md:p-8">
            <div className="flex h-full min-h-0 w-full flex-row gap-4 overflow-hidden">
                <div className="min-h-0 overflow-hidden rounded-md border border-slate-200 bg-white">
                    <FriendNav
                        status={currentStatus}
                        hasUnreadRequest={hasUnreadFriendRequest}
                        hasUnreadChat={hasUnreadChatMessage}
                    />
                </div>

                <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-md border border-slate-200 bg-white">
                    {currentStatus === "friend" && (
                        <Suspense fallback={<FriendTabSkeleton />}>
                            <FriendTabSection
                                accessToken={accessToken}
                                currentFriendId={currentFriendId}
                            />
                        </Suspense>
                    )}

                    {currentStatus === "request" && (
                        <Suspense fallback={<RequestTabSkeleton />}>
                            <RequestTabSection accessToken={accessToken} />
                        </Suspense>
                    )}

                    {currentStatus === "chat" && (
                        <Suspense fallback={<ChatTabSkeleton />}>
                            <ChatTabSection
                                accessToken={accessToken}
                                currentRoomId={currentRoomId}
                            />
                        </Suspense>
                    )}
                </div>
            </div>
        </div>
    );
}
