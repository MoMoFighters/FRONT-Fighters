"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageCirclePlus } from "lucide-react";

import ChatRoomItem from "@/components/common/ChatRoomItem";
import CreateGroupChatModal from "@/features/phone/components/friend/CreateGroupChatModal";
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
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isGroupChatModalOpen, setIsGroupChatModalOpen] = useState(false);
    const rooms = liveRooms ?? initialRooms;
    const myChatRoomId = useMemo(() => {
        if (rooms.length === 0) {
            return null;
        }

        return Math.min(...rooms.map((room) => room.roomId));
    }, [rooms]);
    const filteredRooms = useMemo(() => {
        const keyword = searchKeyword.trim().toLowerCase();

        if (!keyword) {
            return rooms;
        }

        return rooms.filter((room) => {
            const roomTitle = room.roomTitle?.toLowerCase() ?? "";
            const memberNames = room.memberInfo
                .map((member) => `${member.nickname ?? ""} ${member.name ?? ""}`)
                .join(" ")
                .toLowerCase();

            return roomTitle.includes(keyword) || memberNames.includes(keyword);
        });
    }, [rooms, searchKeyword]);

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
        <>
            <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
                <p className="shrink-0 font-bold text-slate-900">
                    채팅 목록
                </p>
                <input
                    value={searchKeyword}
                    onChange={(event) => setSearchKeyword(event.target.value)}
                    placeholder="채팅방 검색"
                    className="h-8 min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />

                {/* 단체 채팅 개설 진입점 - PC/태블릿(lg 이상)은 빈 채팅 화면 쪽 진입점으로 충분해서 모바일에서만 노출 */}
                <button
                    type="button"
                    onClick={() => setIsGroupChatModalOpen(true)}
                    aria-label="단체 채팅 개설"
                    title="단체 채팅 개설"
                    className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
                >
                    <MessageCirclePlus className="h-5 w-5" />
                </button>
            </div>

            <CreateGroupChatModal
                open={isGroupChatModalOpen}
                onOpenChange={setIsGroupChatModalOpen}
            />

            <div className="min-h-0 flex-1 overflow-y-auto scrollbar-none">
                {filteredRooms.length > 0 ? (
                    filteredRooms.map((room) => (
                        <ChatRoomItem
                            key={room.roomId}
                            data={room}
                            myChatRoomId={myChatRoomId}
                        />
                    ))
                ) : (
                    <div className="flex h-full items-center justify-center p-5 text-center text-sm text-slate-400">
                        {rooms.length > 0
                            ? "검색 결과가 없습니다."
                            : "채팅방이 존재하지 않습니다."}
                    </div>
                )}
            </div>
        </>
    );
}
