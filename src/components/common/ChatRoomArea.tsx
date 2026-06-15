'use client'

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";

import close from '@/app/assets/img/close.svg';

import ChatItem from "./ChatItem";
import MessageInputBox from "@/features/phone/components/chat/MessageInputBox";
import { ChatMessage, getChatHistoryService } from "@/app/services/phone/chat/service";
import { toast } from "sonner";
import { leaveChatroomAction, readMessageAction } from "@/features/chat/action";
import { Button } from "../ui/button";
import MyFriendListModal from "@/features/phone/components/friend/MyFriendListModal";
import { getSocket } from "@/lib/socket";


interface ChatRoomAreaProps {
    currentRoomId: number | null;
    accessToken: string;
    isMine: boolean
}

export default function ChatRoomArea({
    currentRoomId,
    accessToken,
    isMine
}: ChatRoomAreaProps) {

    const pathname = usePathname();
    const router = useRouter();

    // 채팅 전송 시 데이터 재fetching 요청용
    const [reload, setReload] = useState(false);

    // 스크롤바 위치, 위로 가면 새 채팅 내역 요청해야해서, isbottom은 나중에 웹소켓 구현시 버람
    const [isBottom, setIsBottom] = useState(true);
    const [isLoadingOld, setIsLoadingOld] = useState(false);


    const [messages, setMessages] =
        useState<ChatMessage[]>([]);

    const href =
        pathname.startsWith('/teacher')
            ? '/teacher/ask'
            : '/student/phone/friends?status=chat';

    const scrollRef = useRef<HTMLDivElement>(null);


    const handleLeaveRoom = async (currentRoomId: number) => {
        const response = await leaveChatroomAction(currentRoomId);
        if (response.status !== 200) {
            toast.error(response.message, { duration: 1000 })
            return
        }
        toast(response.message);
        router.push(href);
    }

    useEffect(() => {
        if (scrollRef.current && isBottom) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [currentRoomId, messages, isBottom])

    useEffect(() => {
        if (!currentRoomId) {
            return;
        }

        const loadMessages = async () => {
            try {
                const response =
                    await getChatHistoryService({
                        roomId: currentRoomId,
                        accessToken,
                    });
                setMessages(
                    response.data ?? []
                );
            } catch {
                setMessages([]);
            }
        };

        loadMessages();
    }, [
        currentRoomId,
        accessToken,
        reload,
    ]);

    useEffect(() => {
        if (!currentRoomId) {
            return;
        }

        const socket = getSocket(accessToken);

        if (!socket.connected) {
            socket.connect();
        }

        socket.emit("joinRoom", currentRoomId);
        socket.emit("room:join", { roomId: currentRoomId });

        const handleReceiveMessage = (payload: unknown) => {
            const messagePayload = payload as {
                roomId?: number;
                data?: ChatMessage;
                message?: ChatMessage;
            } & Partial<ChatMessage>;

            if (
                messagePayload.roomId &&
                messagePayload.roomId !== currentRoomId
            ) {
                return;
            }

            const newMessage =
                messagePayload.data ??
                messagePayload.message ??
                messagePayload;

            if (!newMessage.messageId) {
                return;
            }

            setMessages(prev => {
                const alreadyExists = prev.some(
                    message =>
                        message.messageId ===
                        newMessage.messageId
                );

                if (alreadyExists) {
                    return prev;
                }

                return [
                    ...prev,
                    newMessage as ChatMessage
                ];
            });

            readMessageAction(currentRoomId);
        };

        const handleConnectError = () => {
            toast.error(
                '채팅 서버 연결에 실패했습니다.',
                { duration: 1000 }
            );
        };

        socket.on("receiveMessage", handleReceiveMessage);
        socket.on("newMessage", handleReceiveMessage);
        socket.on("message", handleReceiveMessage);
        socket.on("chat:message", handleReceiveMessage);
        socket.on("connect_error", handleConnectError);

        return () => {
            socket.emit("leaveRoom", currentRoomId);
            socket.emit("room:leave", { roomId: currentRoomId });

            socket.off("receiveMessage", handleReceiveMessage);
            socket.off("newMessage", handleReceiveMessage);
            socket.off("message", handleReceiveMessage);
            socket.off("chat:message", handleReceiveMessage);
            socket.off("connect_error", handleConnectError);
        };
    }, [
        currentRoomId,
        accessToken,
    ]);

    const handleScroll = async (
        e: React.UIEvent<HTMLDivElement>
    ) => {
        if (!currentRoomId) {

            setMessages([]);
            return;
        }

        if (isBottom) {
            setIsBottom(false)
        }
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = e.currentTarget;

        if (
            scrollHeight -
            scrollTop -
            clientHeight <
            10
        ) {
            setIsBottom(true)
        }
        if (e.currentTarget.scrollTop === 0 && !isLoadingOld) {
            setIsLoadingOld(true);
            try {
                const oldestMessageId =
                    messages[0]?.messageId;
                const response = await getChatHistoryService({
                    roomId: currentRoomId,
                    accessToken,
                    lastMessageId: oldestMessageId
                });
                const newdata: ChatMessage[] = [
                    ...(response.data ?? []),
                    ...messages,
                ];
                setMessages(newdata);

            } catch {
                toast.error('메시지를 불러오는 중 오류가 발생했습니다.')
            } finally {
                setIsLoadingOld(false);
            }
        };
    }


    if (!currentRoomId) {

        return (
            <div
                className="flex justify-center items-center h-full flex-col gap-2"
            >
                <MyFriendListModal />
                <p className="font-bold text-2xl">
                    단체 채팅을 시작하려면 클릭하세요.
                </p>
            </div>
        );
    }

    const opponentName = messages.filter(item => !item.isMine)[0]?.nickname ?? '알수없음';

    return (
        <>
            <div className="flex flex-col h-full min-h-0">
                <div
                    className="h-14 shrink-0 border-b border-slate-200 bg-slate-50 pl-2 py-2 flex flex-row items-center gap-2"
                >
                    <div className="flex items-center">
                        {isMine ? (
                            <p className="ml-2 text-lg font-semibold text-slate-900">
                                나와의 채팅
                            </p>
                        ) : (
                            <>
                                <p className="ml-2 text-lg font-semibold text-slate-900">
                                    {opponentName}
                                </p>
                                <p className="text-[12px] ml-1 font-semibold text-slate-500">
                                    님과의 대화
                                </p>
                            </>
                        )}
                    </div>

                    {isMine ? "" : (
                        <Button
                            className="px-2 py-1 bg-rose-400 hover:bg-rose-500"
                            onClick={() => handleLeaveRoom(currentRoomId)}
                        >
                            나가기
                        </Button>
                    )}

                    <div className="flex-1"></div>

                    <Link href={href}>
                        <Image
                            src={close}
                            alt="닫기"
                            className="h-8 w-8 mr-1"
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
                                key={message.messageId}
                                id={message.messageId}
                                isMine={message.isMine}
                                message={message.content}
                                time={new Date(
                                    message.createdAt
                                ).toLocaleTimeString("ko-KR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            />
                        ))
                    )}
                </div>

                <div
                    className="shrink-0 border-t border-slate-200 bg-white"
                >
                    <MessageInputBox
                        key={currentRoomId}
                        chatRoomId={currentRoomId}
                        reload={{ reload, setReload }}
                    />
                </div>
            </div>
        </>
    );
}
