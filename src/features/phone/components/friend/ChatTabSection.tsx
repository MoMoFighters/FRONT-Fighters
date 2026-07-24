import ChatRoomArea from "@/components/common/ChatRoomArea";
import ChatRoomListPanel from "@/components/common/ChatRoomListPanel";

import { getChatRoomsService } from "@/app/services/phone/chat/service";

interface ChatTabSectionProps {
    accessToken: string;
    currentRoomId: number | null;
}

export default async function ChatTabSection({
    accessToken,
    currentRoomId,
}: ChatTabSectionProps) {
    const roomResponse = await getChatRoomsService(accessToken);
    const chatRoomData = roomResponse.status === 200 ? roomResponse.data ?? [] : [];

    const myChatRoom =
        chatRoomData.length > 0
            ? chatRoomData.reduce((smallestRoom, room) =>
                room.roomId < smallestRoom.roomId ? room : smallestRoom
            )
            : undefined;

    return (
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
    );
}
