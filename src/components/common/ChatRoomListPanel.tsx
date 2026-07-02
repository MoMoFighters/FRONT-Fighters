"use client";

import { useEffect, useMemo, useState } from "react";

import ChatRoomItem from "@/components/common/ChatRoomItem";
import {
    ChatRoomListData,
    normalizeChatRoomListData,
    RawChatRoomListResponseData,
} from "@/app/services/phone/chat/service";
import { connectNoticeStomp } from "@/lib/stomp/stomp";

interface ChatRoomListPanelProps {
    accessToken: string;
    initialRooms: ChatRoomListData[];
}

export default function ChatRoomListPanel({
    accessToken,
    initialRooms,
}: ChatRoomListPanelProps) {
    const [liveRooms, setLiveRooms] = useState<ChatRoomListData[] | null>(null);
    const rooms = liveRooms ?? initialRooms;
    const myChatRoomId = useMemo(() => {
        if (rooms.length === 0) {
            return null;
        }

        return Math.min(...rooms.map((room) => room.roomId));
    }, [rooms]);

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
                    "/user/sub/chat/rooms",
                    (body) => {
                        const data = JSON.parse(body) as RawChatRoomListResponseData;
                        setLiveRooms(normalizeChatRoomListData(data));
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
        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-none">
            {rooms.length > 0 ? (
                rooms.map(room => (
                    <ChatRoomItem
                        key={room.roomId}
                        data={room}
                        myChatRoomId={myChatRoomId}
                    />
                ))
            ) : (
                <div className="flex h-full items-center justify-center p-5 text-center text-sm text-slate-400">
                    채팅방이 존재하지 않습니다.
                </div>
            )}
        </div>
    );
}
