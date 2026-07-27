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

    // 모바일(lg 미만)에서는 목록/상세를 동시에 쌓아 보여주지 않고, 채팅방을 선택하면(roomId 존재)
    // 상세 화면이 목록을 완전히 덮어쓰도록 하나만 보이게 전환한다. lg 이상에서는 항상 둘 다 보인다.
    const showListOnMobile = currentRoomId === null;

    return (
        <div className="grid h-full max-h-full min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[3fr_7fr]">
            <div
                className={`min-h-0 flex-col overflow-hidden bg-white lg:flex ${showListOnMobile ? "flex" : "hidden"
                    }`}
            >
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

            <div
                className={`min-h-0 min-w-0 overflow-hidden bg-white lg:block ${showListOnMobile ? "hidden" : "block"
                    }`}
            >
                <ChatRoomArea
                    currentRoomId={currentRoomId}
                    accessToken={accessToken}
                    isMine={currentRoomId === myChatRoom?.roomId}
                />
            </div>
        </div>
    );
}
