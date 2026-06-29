"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { toast } from "sonner";

import ChatItem from "./ChatItem";
import MessageInputBox from "@/features/phone/components/chat/MessageInputBox";
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
    leaveChatroomAction,
    readMessageAction,
} from "@/features/chat/action";
import { Button } from "../ui/button";
import MyFriendListModal from "@/features/phone/components/friend/MyFriendListModal";
import { connectNoticeStomp } from "@/lib/stomp/stomp";

interface ChatRoomAreaProps {
    currentRoomId: number | null;
    accessToken: string;
    isMine?: boolean;
}

const formatMessageTime = (createdAt: string) => {
    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

export default function ChatRoomArea({
    currentRoomId,
    accessToken,
    isMine = false,
}: ChatRoomAreaProps) {
    const pathname = usePathname();
    const router = useRouter();
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

    const href = pathname.startsWith("/teacher")
        ? "/teacher/ask"
        : "/student/phone/friends?status=chat";

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

    const handleLeaveRoom = async (roomId: number) => {
        const response = await leaveChatroomAction(roomId);

        if (response.status !== 200) {
            toast.error(response.message, { duration: 1000 });
            return;
        }

        toast(response.message);
        router.push(href);
    };

    useEffect(() => {
        if (scrollRef.current && isBottom) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [currentRoomId, messages, isBottom]);

    useEffect(() => {
        if (!currentRoomId) {
            lastEnteredRoomIdRef.current = null;
            lastReadRequestedMessageIdRef.current = null;
            applyChatHistory();
            return;
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
        return (
            <div className="flex justify-center items-center h-full flex-col gap-2">
                <MyFriendListModal />
                <p className="font-bold text-2xl">
                    단체 채팅을 시작하려면 클릭하세요
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
            <div className="flex flex-col h-full min-h-0">
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
                    </div>

                    {!isMine && (
                        <Button
                            className="px-2 py-1 bg-rose-400 hover:bg-rose-500"
                            onClick={() => handleLeaveRoom(currentRoomId)}
                        >
                            나가기
                        </Button>
                    )}

                    <div className="flex-1" />

                    <Link href={href} aria-label="닫기">
                        <X
                            className="mr-1 h-8 w-8 text-slate-700 hover:text-slate-950"
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
                        messages.map((message) => (
                            <ChatItem
                                profileImg={message.profileImageUrl || ""}
                                nickname={message?.nickname || message?.name || "알 수 없음"}
                                key={`${message.type ?? "message"}-${message.messageId}`}
                                id={message.messageId}
                                isMine={message.type ? null : message.isMine}
                                message={message.content}
                                time={formatMessageTime(message.createdAt)}
                                senderId={message.senderId}
                            />
                        ))
                    )}
                </div>

                <div className="shrink-0 border-t border-slate-200 bg-white">
                    <MessageInputBox
                        key={currentRoomId}
                        chatRoomId={currentRoomId}
                    />
                </div>
            </div>
        </>
    );
}
