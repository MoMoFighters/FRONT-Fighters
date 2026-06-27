'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageCircle, UserPlus, Bell } from "lucide-react";

import { getNoticeNotificationListAction } from "./action";
import { connectNoticeStomp } from "./stomp";
import { NoticeNotification } from "./type";

interface NotificationListProps {
    accessToken: string;
    onClose: () => void;
}

const getNotificationHref = (notification: NoticeNotification) => {
    switch (notification.type) {
        case "MESSAGE":
            return `/student/phone/friends?roomId=${notification.refId}`;
        case "FRIEND_REQUEST":
            return "/student/phone/friends?status=request";
        case "COMMUNITY":
            return `/student/phone/community/${notification.refId}`;
        case "CALENDAR":
            return `/student/phone/calendar?month=${notification.refId}`;
        default:
            return "/student";
    }
};

const getNotificationIcon = (type: string) => {
    if (type === "MESSAGE") {
        return <MessageCircle className="h-4 w-4" />;
    }

    if (type === "FRIEND_REQUEST") {
        return <UserPlus className="h-4 w-4" />;
    }

    return <Bell className="h-4 w-4" />;
};

export default function NotificationList({
    accessToken,
    onClose,
}: NotificationListProps) {
    const [notifications, setNotifications] = useState<NoticeNotification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadNotifications = async () => {
            const response = await getNoticeNotificationListAction();

            if (!isMounted) {
                return;
            }

            setNotifications(response.data ?? []);
            setIsLoading(false);
        };

        void loadNotifications();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!accessToken) {
            return;
        }

        let subscription:
            | ReturnType<ReturnType<typeof connectNoticeStomp>["subscribe"]>
            | undefined;
        const client = connectNoticeStomp({
            accessToken,
            onConnect: (stompClient) => {
                subscription =
                    stompClient.subscribe(
                        "/user/sub/notice/list",
                        (body) => {
                            const data =
                                JSON.parse(body) as NoticeNotification[];

                            setNotifications(data);
                        }
                    );
            },
        });

        return () => {
            subscription?.unsubscribe();
            client.disconnect();
        };
    }, [accessToken]);

    return (
        <div
            className="fixed right-0 top-0 h-screen w-screen"
            onClick={onClose}
        >
            <div
                className="fixed right-44 top-15 flex max-h-106 min-h-30 w-80 flex-col overflow-hidden rounded-xl border border-slate-300 bg-white/80 shadow-xl shadow-slate-900/10 backdrop-blur-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="rounded-t-xl border-b border-slate-500/30 px-5 py-3">
                    <h3 className="font-bold text-slate-800">
                        알림 목록
                    </h3>
                </div>

                <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex h-32 items-center justify-center text-sm font-bold text-slate-400">
                            알림을 불러오는 중입니다.
                        </div>
                    ) : notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <Link
                                key={notification.id}
                                href={getNotificationHref(notification)}
                                onClick={onClose}
                                className="flex w-full items-start gap-3 border-b border-slate-200/70 bg-white/25 px-4 py-3 transition hover:bg-white/90 hover:shadow-sm"
                            >
                                <span
                                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                        notification.isRead
                                            ? "bg-slate-100 text-slate-400"
                                            : "bg-indigo-50 text-indigo-500"
                                    }`}
                                >
                                    {getNotificationIcon(notification.type)}
                                </span>

                                <span className="min-w-0 flex-1">
                                    <span className="line-clamp-2 text-sm font-bold leading-5 text-slate-800">
                                        {notification.message}
                                    </span>
                                    <span className="mt-1 block text-[11px] font-semibold text-slate-400">
                                        {notification.createdAt.replace("T", " ")}
                                    </span>
                                </span>

                                {!notification.isRead && (
                                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                                )}
                            </Link>
                        ))
                    ) : (
                        <div className="flex h-32 items-center justify-center text-sm font-bold text-slate-400">
                            알림이 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
