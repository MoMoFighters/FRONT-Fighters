"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { toast } from "sonner";

import emptySelectChatRoom from "@/app/assets/img/empty-select-chat-room.svg";
import ChatItem from "./ChatItem";
import MessageInputBox from "@/features/phone/components/chat/MessageInputBox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    ChatHistoryData,
    ChatMessageData,
    ChatRoomInfoData,
    ChatRoomMemberData,
    getChatRoomSubscribeDestination,
    normalizeChatHistoryData,
} from "@/app/services/phone/chat/service";
import {
    getChatHistoryAction,
    getChatRoomMembersAction,
    readMessageAction,
} from "@/features/chat/action";
import type { ChatRoomMemberInfo } from "@/features/chat/type";
import MyFriendListModal from "@/features/phone/components/friend/MyFriendListModal";
import { connectNoticeStomp } from "@/lib/stomp/stomp";

interface ChatRoomAreaProps {
    currentRoomId: number | null;
    accessToken: string;
    isMine?: boolean;
}

const CHAT_ROLE_LABEL: Record<string, string> = {
    STUDENT: "학생",
    TEACHER: "강사",
    ADMIN: "관리자",
};

const CHAT_STATUS_LABEL: Record<string, string> = {
    me: "나",
    FRIEND: "친구",
    FREIND: "친구",
    SENT: "초대됨",
    BLOCK: "차단",
    none: "",
};

const formatMessageTime = (createdAt: string) => {
    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const period = hours < 12 ? "오전" : "오후";
    const displayHours = hours % 12 || 12;

    return `${period} ${String(displayHours).padStart(2, "0")}:${minutes}`;
};

const getMessageDateKey = (createdAt: string) => {
    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const formatMessageDateLabel = (createdAt: string) => {
    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${date.getFullYear()}년 ${month}월 ${day}일`;
};

export default function ChatRoomArea({
    currentRoomId,
    accessToken,
    isMine = false,
}: ChatRoomAreaProps) {
    const pathname = usePathname();
    const scrollRef = useRef<HTMLDivElement>(null);
    const readMessageTimerRef = useRef<number | null>(null);
    const isReadMessagePendingRef = useRef(false);
    const lastReadRequestedMessageIdRef = useRef<number | null>(null);
    const lastEnteredRoomIdRef = useRef<number | null>(null);

    const [isBottom, setIsBottom] = useState(true);
    const [isLoadingOld, setIsLoadingOld] = useState(false);
    const [roomInfo, setRoomInfo] = useState<ChatRoomInfoData | null>(null);
    const [memberInfo, setMemberInfo] = useState<ChatRoomMemberData[]>([]);
    const [messages, setMessages] = useState<ChatMessageData[]>([]);
    const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
    const [isMembersLoading, setIsMembersLoading] = useState(false);
    const [roomMembers, setRoomMembers] = useState<ChatRoomMemberInfo[]>([]);

    const href = pathname.startsWith("/teacher")
        ? "/teacher/ask"
        : "/student/friends?status=chat";

    const handleOpenMemberDialog = async () => {
        if (!currentRoomId) {
            return;
        }

        setIsMemberDialogOpen(true);
        setIsMembersLoading(true);

        const response = await getChatRoomMembersAction(currentRoomId);

        if (response.status !== 200) {
            toast.error(
                response.message || "채팅방 멤버 정보를 불러오지 못했습니다."
            );
            setRoomMembers([]);
            setIsMembersLoading(false);
            return;
        }

        setRoomMembers(response.data?.memberInfo ?? []);
        setIsMembersLoading(false);
    };

    const applyChatHistory = useCallback((chatHistory?: ChatHistoryData) => {
        setRoomInfo(chatHistory?.roomInfo ?? null);
        setMemberInfo(chatHistory?.memberInfo ?? []);
        setMessages(chatHistory?.messages ?? []);
    }, []);

    const requestReadMessage = useCallback((
        roomId: number,
        messageId?: number
    ) => {
        if (
            messageId !== undefined &&
            lastReadRequestedMessageIdRef.current === messageId
        ) {
            return;
        }

        if (messageId !== undefined) {
            lastReadRequestedMessageIdRef.current = messageId;
        }

        if (readMessageTimerRef.current !== null || isReadMessagePendingRef.current) {
            return;
        }

        readMessageTimerRef.current = window.setTimeout(async () => {
            readMessageTimerRef.current = null;
            isReadMessagePendingRef.current = true;

            try {
                await readMessageAction(roomId);
            } finally {
                isReadMessagePendingRef.current = false;
            }
        }, 700);
    }, []);

    const readCurrentRoomMessage = useCallback(async (roomId: number) => {
        if (isReadMessagePendingRef.current) {
            return;
        }

        isReadMessagePendingRef.current = true;

        try {
            await readMessageAction(roomId);
        } finally {
            isReadMessagePendingRef.current = false;
        }
    }, []);

    useEffect(() => {
        if (scrollRef.current && isBottom) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [currentRoomId, messages, isBottom]);

    useEffect(() => {
        if (!currentRoomId) {
            lastEnteredRoomIdRef.current = null;
            lastReadRequestedMessageIdRef.current = null;
            const animationFrameId = window.requestAnimationFrame(() => {
                applyChatHistory();
            });

            return () => {
                window.cancelAnimationFrame(animationFrameId);
            };
        }

        const loadMessages = async () => {
            try {
                const response = await getChatHistoryAction(currentRoomId);
                const chatHistory = normalizeChatHistoryData(response.data);

                applyChatHistory(chatHistory);
            } catch {
                applyChatHistory();
            }
        };

        void loadMessages();
    }, [
        currentRoomId,
        accessToken,
        applyChatHistory,
    ]);

    useEffect(() => {
        if (!currentRoomId) {
            return;
        }

        let subscription:
            | ReturnType<ReturnType<typeof connectNoticeStomp>["subscribe"]>
            | undefined;
        const client = connectNoticeStomp({
            accessToken,
            onConnect: (stompClient) => {
                subscription = stompClient.subscribe(
                    getChatRoomSubscribeDestination(currentRoomId),
                    (body) => {
                        const payload = JSON.parse(body) as
                            | ChatHistoryData[]
                            | ChatHistoryData;
                        const chatHistory = normalizeChatHistoryData(payload);
                        const newestIncomingMessageId =
                            chatHistory?.messages
                                .filter((message) => !message.isMine)
                                .at(-1)?.messageId;

                        applyChatHistory(chatHistory);
                        requestReadMessage(
                            currentRoomId,
                            newestIncomingMessageId
                        );
                    }
                );

                if (lastEnteredRoomIdRef.current !== currentRoomId) {
                    lastEnteredRoomIdRef.current = currentRoomId;
                    lastReadRequestedMessageIdRef.current = null;
                    void readCurrentRoomMessage(currentRoomId);
                }
            },
        });
        return () => {
            subscription?.unsubscribe();
            client.disconnect();
        };
    }, [
        currentRoomId,
        accessToken,
        applyChatHistory,
        requestReadMessage,
        readCurrentRoomMessage,
    ]);

    useEffect(() => {
        return () => {
            if (readMessageTimerRef.current !== null) {
                window.clearTimeout(readMessageTimerRef.current);
            }
        };
    }, []);

    const handleScroll = async (
        e: React.UIEvent<HTMLDivElement>
    ) => {
        if (!currentRoomId) {
            applyChatHistory();
            return;
        }

        const {
            scrollTop,
            scrollHeight,
            clientHeight,
        } = e.currentTarget;

        if (isBottom) {
            setIsBottom(false);
        }

        if (scrollHeight - scrollTop - clientHeight < 10) {
            setIsBottom(true);
        }

        if (scrollTop !== 0 || isLoadingOld) {
            return;
        }

        const oldestMessageId = messages[0]?.messageId;

        if (!oldestMessageId) {
            return;
        }

        setIsLoadingOld(true);

        try {
            const response = await getChatHistoryAction(
                currentRoomId,
                oldestMessageId
            );

            const chatHistory = normalizeChatHistoryData(response.data);

            if (chatHistory?.roomInfo) {
                setRoomInfo(chatHistory.roomInfo);
            }

            if (chatHistory?.memberInfo) {
                setMemberInfo(chatHistory.memberInfo);
            }

            setMessages((currentMessages) => {
                const previousMessages = chatHistory?.messages ?? [];
                const currentIds = new Set(
                    currentMessages.map((message) => message.messageId)
                );

                return [
                    ...previousMessages.filter(
                        (message) => !currentIds.has(message.messageId)
                    ),
                    ...currentMessages,
                ];
            });
        } catch {
            toast.error("메시지를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setIsLoadingOld(false);
        }
    };

    if (!currentRoomId) {
        if (pathname.startsWith("/teacher")) {
            return (
                <div className="flex h-full flex-col items-center justify-center gap-2">
                    <Image
                        src={emptySelectChatRoom}
                        alt="채팅방을 선택해주세요"
                        width={140}
                        height={140}
                    />
                    <p className="font-bold text-lg text-slate-500">
                        왼쪽 목록에서 채팅방을 선택해주세요
                    </p>
                </div>
            );
        }

        return (
            <div className="flex justify-center items-center h-full flex-col gap-2">
                <MyFriendListModal />
                <p className="font-bold text-lg text-slate-500">
                    채팅을 시작하려면 클릭해주세요
                </p>
            </div>
        );
    }

    const opponent =
        memberInfo.find((member) => member.status !== "me") ??
        memberInfo[0];
    const roomTitle =
        roomInfo?.roomTitle ??
        (
            isMine ||
                roomInfo?.inMemberCount === 1 ||
                opponent?.status === "me"
                ? "나와의 채팅"
                : opponent?.nickname ?? "채팅방"
        );
    const roomSubTitle =
        roomInfo?.roomTitle
            ? `${roomInfo.inMemberCount}명`
            : opponent?.role === "TEACHER"
                ? "강사와의 대화"
                : "";

    return (
        <>
            <div className="flex h-full max-h-full min-h-0 flex-col overflow-hidden">
                <div className="h-14 shrink-0 border-b border-slate-200 bg-slate-50 pl-2 py-2 flex flex-row items-center gap-2">
                    <div className="flex items-center">
                        <p className="ml-2 text-lg font-semibold text-slate-900">
                            {roomTitle}
                        </p>
                        {roomSubTitle && (
                            <p className="text-[12px] ml-1 font-semibold text-slate-500">
                                {roomSubTitle}
                            </p>
                        )}
                        <button
                            type="button"
                            onClick={() => void handleOpenMemberDialog()}
                            className="text-xs px-2 py-1 ml-2 border border-slate-500 select-none cursor-pointer rounded-md hover:bg-indigo-100"
                        >
                            멤버 보기
                        </button>
                    </div>

                    <div className="flex-1" />

                    <Link href={href} aria-label="닫기">
                        <X
                            className="mr-3 h-6 w-6 text-slate-700 hover:text-slate-950"
                            aria-hidden="true"
                        />
                    </Link>
                </div>

                <div
                    ref={scrollRef}
                    className="flex-1 min-h-0 overflow-y-auto scrollbar-none p-4 flex flex-col gap-3 bg-slate-50"
                    onScroll={handleScroll}
                >
                    {messages.length === 0 ? (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-slate-400">
                                아직 채팅 내역이 없습니다.
                            </p>
                        </div>
                    ) : (
                        messages.map((message, index) => {
                            const currentDateKey = getMessageDateKey(message.createdAt);
                            const previousDateKey =
                                index > 0
                                    ? getMessageDateKey(messages[index - 1].createdAt)
                                    : "";
                            const shouldShowDateDivider =
                                currentDateKey !== "" &&
                                currentDateKey !== previousDateKey;

                            return (
                                <Fragment key={`${message.type ?? "message"}-${message.messageId}`}>
                                    {shouldShowDateDivider && (
                                        <div className="flex w-full justify-center select-none">
                                            <div className="min-w-10 max-w-fit rounded-full bg-slate-200/70 px-4 py-1">
                                                <p className="text-center text-xs text-slate-500">
                                                    {formatMessageDateLabel(message.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <ChatItem
                                        profileImg={message.profileImageUrl || ""}
                                        nickname={message?.nickname || message?.name || "알 수 없음"}
                                        id={message.messageId}
                                        isMine={message.type ? null : message.isMine}
                                        message={message.content}
                                        time={formatMessageTime(message.createdAt)}
                                        unreadCount={message.unreadCount}
                                        senderId={message.senderId}
                                    />
                                </Fragment>
                            );
                        })
                    )}
                </div>

                <div className="shrink-0 border-t border-slate-200 bg-white">
                    <MessageInputBox
                        key={currentRoomId}
                        chatRoomId={currentRoomId}
                    />
                </div>
            </div>

            <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>채팅방 멤버</DialogTitle>
                        <DialogDescription>
                            현재 채팅방에 참여 중인 멤버 목록입니다.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="max-h-80 overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50 p-3">
                        {isMembersLoading ? (
                            <div className="py-10 text-center text-sm font-bold text-slate-400">
                                멤버 정보를 불러오는 중입니다.
                            </div>
                        ) : roomMembers.length > 0 ? (
                            roomMembers.map((member) => (
                                <div
                                    key={member.userId}
                                    className="mb-2 flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3"
                                >
                                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-indigo-50">
                                        {member.profileImageUrl ? (
                                            <Image
                                                src={member.profileImageUrl}
                                                alt="프로필"
                                                fill
                                                sizes="40px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-indigo-500">
                                                {member.nickname.slice(0, 1)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-bold text-slate-800">
                                            {member.nickname}
                                        </p>
                                        <p className="text-xs font-medium text-slate-400">
                                            {CHAT_ROLE_LABEL[member.role] ?? member.role}
                                            {CHAT_STATUS_LABEL[member.status]
                                                ? ` · ${CHAT_STATUS_LABEL[member.status]}`
                                                : ""}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-10 text-center text-sm font-bold text-slate-400">
                                멤버 정보가 없습니다.
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
