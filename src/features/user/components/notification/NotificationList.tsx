'use client'

import DeleteModal from "@/features/modal/DeleteModal";
import NotificationItem from "@/components/city/NotificationItem";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import {
    deleteNoticeAction,
    getNoticeNotificationListAction,
    readNoticeAction,
} from "./action";
import { connectNoticeStomp } from "../../../../lib/stomp/stomp";
import { NoticeNotification } from "./type";

interface NotificationListProps {
    accessToken: string;
    onClose: () => void;
}

const getNotificationType = (
    notification: NoticeNotification
): "friend" | "calendar" | "community" | "message" => {
    switch (notification.type) {
        case "MESSAGE":
            return "message";
        case "FRIEND_REQUEST":
            return "friend";
        case "CALENDAR":
            return "calendar";
        case "COMMUNITY":
            return "community";
        default:
            return "community";
    }
};

const isSuccessResponse = (status?: number) =>
    typeof status === "number" && status >= 200 && status < 300;

export default function NotificationList({
    accessToken,
    onClose,
}: NotificationListProps) {
    const [notifications, setNotifications] = useState<NoticeNotification[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMutating, setIsMutating] = useState(false);

    const selectedNotifications = useMemo(
        () =>
            notifications.filter((notification) =>
                selectedIds.includes(notification.notificationId)
            ),
        [notifications, selectedIds]
    );

    const selectedUnreadIds = useMemo(
        () =>
            selectedNotifications
                .filter((notification) => !notification.isRead)
                .map((notification) => notification.notificationId),
        [selectedNotifications]
    );

    const isAllSelected =
        notifications.length > 0 && selectedIds.length === notifications.length;

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
                subscription = stompClient.subscribe(
                    "/user/sub/notice/list",
                    (body) => {
                        const data = JSON.parse(body) as NoticeNotification[];
                        const nextIds = new Set(
                            data.map((notification) => notification.notificationId)
                        );

                        setNotifications(data);
                        setSelectedIds((currentIds) =>
                            currentIds.filter((id) => nextIds.has(id))
                        );
                    }
                );
            },
        });

        return () => {
            subscription?.unsubscribe();
            client.disconnect();
        };
    }, [accessToken]);

    const handleSelect = (id: number, isSelected: boolean) => {
        setSelectedIds((currentIds) => {
            if (isSelected) {
                return currentIds.includes(id)
                    ? currentIds
                    : [...currentIds, id];
            }

            return currentIds.filter((currentId) => currentId !== id);
        });
    };

    const handleSelectAll = (isSelected: boolean) => {
        setSelectedIds(
            isSelected
                ? notifications.map((notification) => notification.notificationId)
                : []
        );
    };

    const markNotificationsAsRead = (ids: number[]) => {
        setNotifications((currentNotifications) =>
            currentNotifications.map((notification) =>
                ids.includes(notification.notificationId)
                    ? { ...notification, isRead: true }
                    : notification
            )
        );
    };

    const removeNotifications = (ids: number[]) => {
        setNotifications((currentNotifications) =>
            currentNotifications.filter(
                (notification) => !ids.includes(notification.notificationId)
            )
        );
        setSelectedIds((currentIds) =>
            currentIds.filter((id) => !ids.includes(id))
        );
    };

    const handleReadSelected = async () => {
        if (selectedUnreadIds.length === 0 || isMutating) {
            return;
        }

        setIsMutating(true);
        const result = await readNoticeAction(selectedUnreadIds);
        setIsMutating(false);

        if (isSuccessResponse(result.status)) {
            markNotificationsAsRead(selectedUnreadIds);
            setSelectedIds([]);
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0 || isMutating) {
            return;
        }

        const deleteTargetIds = [...selectedIds];

        setIsMutating(true);
        const result = await deleteNoticeAction(deleteTargetIds);
        setIsMutating(false);

        if (isSuccessResponse(result.status)) {
            removeNotifications(deleteTargetIds);
        }
    };

    const handleReadOne = async (id: number) => {
        const targetNotification = notifications.find(
            (notification) => notification.notificationId === id
        );

        if (!targetNotification || targetNotification.isRead) {
            return;
        }

        const result = await readNoticeAction([id]);

        if (isSuccessResponse(result.status)) {
            markNotificationsAsRead([id]);
        }
    };

    const handleDeleteOne = async (id: number) => {
        const result = await deleteNoticeAction([id]);

        if (isSuccessResponse(result.status)) {
            removeNotifications([id]);
        }
    };

    const notificationList = (
        <div
            className="fixed right-0 top-0 z-[999999] h-screen w-screen"
            onClick={onClose}
        >
            <div
                className="fixed z-[999999] right-4 top-15 flex max-h-106 min-h-30 w-[calc(100vw-2rem)] max-w-80 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 backdrop-blur-md sm:right-44 sm:w-80"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="rounded-t-xl border-b border-slate-100 px-5 py-3">
                    <h3 className="font-bold text-slate-800">
                        알림 목록
                    </h3>
                </div>

                {notifications.length > 0 && (
                    <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2 text-xs">
                        <label className="flex cursor-pointer items-center gap-2 text-slate-600">
                            <input
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={(event) =>
                                    handleSelectAll(event.target.checked)
                                }
                                className="h-3.5 w-3.5 accent-indigo-500"
                            />
                            전체
                        </label>

                        <span className="ml-auto text-slate-400">
                            {selectedIds.length}개 선택
                        </span>

                        <button
                            type="button"
                            disabled={
                                selectedUnreadIds.length === 0 || isMutating
                            }
                            onClick={handleReadSelected}
                            className="rounded-md px-2 py-1 font-bold text-indigo-500 transition-colors hover:bg-indigo-50 disabled:cursor-not-allowed disabled:text-slate-300"
                        >
                            읽음
                        </button>

                        <DeleteModal
                            title="알림 삭제"
                            description={`${selectedIds.length}개의 알림을 삭제합니다.\n지워진 알림은 다시 볼 수 없습니다.`}
                            onDelete={handleDeleteSelected}
                            trigger={
                                <button
                                    type="button"
                                    disabled={
                                        selectedIds.length === 0 || isMutating
                                    }
                                    className="rounded-md px-2 py-1 font-bold text-rose-500 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:text-slate-300"
                                >
                                    삭제
                                </button>
                            }
                        />
                    </div>
                )}

                <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex h-32 items-center justify-center text-sm font-bold text-slate-400">
                            알림을 불러오는 중입니다.
                        </div>
                    ) : notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <NotificationItem
                                key={notification.notificationId}
                                id={notification.notificationId}
                                type={getNotificationType(notification)}
                                content={notification.message}
                                onClose={onClose}
                                isRead={notification.isRead}
                                targetId={notification.refId}
                                isSelected={selectedIds.includes(
                                    notification.notificationId
                                )}
                                onSelectChange={(isSelected) =>
                                    handleSelect(
                                        notification.notificationId,
                                        isSelected
                                    )
                                }
                                onRead={() =>
                                    handleReadOne(notification.notificationId)
                                }
                                onDelete={() =>
                                    handleDeleteOne(notification.notificationId)
                                }
                            />
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

    if (typeof document === "undefined") {
        return null;
    }

    return createPortal(notificationList, document.body);
}
