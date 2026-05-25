import ChatItem from "@/components/common/ChatItem";
import ChatRoomItem from "@/components/common/ChatRoomItem";
import { Button } from "@/components/ui/button";
import MessageInputBox from "@/features/phone/chat/MessageInputBox";

interface ChatRoomItemData {
    roomId: string;
    profile: string;
    name: string;
    recentMessage: string;
}

export default function ChatPage() {

    const data = {
        roomId: '1234',
        profile: 'string',
        name: '홍길동',
        recentMessage: '최근 메시지입니다.'
    } as ChatRoomItemData

    return (
        <div className="flex flex-row h-full">
            <div className="flex flex-col w-70 overflow-hidden border-r border-black">
                <div className="flex flex-row h-12 px-2 align-middle border-black border-b">
                    <p className="my-auto">쪽지(최신순)</p>
                    <div className="ml-auto flex-1 flex align-middle justify-end">
                        <p className="my-auto text-right">나와의 채팅</p>
                    </div>
                </div>
                <div className="flex flex-col overflow-y-scroll flex-1">
                    <ChatRoomItem data={data} key={data.roomId} />
                    <ChatRoomItem data={data} key={data.roomId} />
                    <ChatRoomItem data={data} key={data.roomId} />
                    <ChatRoomItem data={data} key={data.roomId} />
                    <ChatRoomItem data={data} key={data.roomId} />
                    <ChatRoomItem data={data} key={data.roomId} />
                    <ChatRoomItem data={data} key={data.roomId} />
                    <ChatRoomItem data={data} key={data.roomId} />
                    <ChatRoomItem data={data} key={data.roomId} />
                    <ChatRoomItem data={data} key={data.roomId} />
                    <ChatRoomItem data={data} key={data.roomId} />
                    <ChatRoomItem data={data} key={data.roomId} />
                    <ChatRoomItem data={data} key={data.roomId} />
                    <ChatRoomItem data={data} key={data.roomId} />
                </div>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex flex-row py-2 px-4 border-b border-black bg-gray-50 h-12">
                    <p className="my-auto">{data.name}님과의 대화</p>
                    <div className="flex-1 ml-2">
                        <Button>나가기</Button>
                    </div>
                    <p className="my-auto">X</p>
                </div>
                <div className="flex flex-col gap-2 p-2 overflow-y-scroll max-h-full bg-mauve-200">
                    <ChatItem />
                    <ChatItem />
                    <ChatItem />
                    <ChatItem />
                    <ChatItem />
                    <ChatItem />
                    <ChatItem />
                    <ChatItem />
                    <ChatItem />
                    <ChatItem />
                    <ChatItem />
                    <ChatItem />
                    <ChatItem />
                    <ChatItem />
                    <ChatItem />
                    <ChatItem />
                    <ChatItem />
                    <ChatItem />
                    <ChatItem />
                    <ChatItem />
                    <ChatItem />
                </div>
                <MessageInputBox />
            </div>
        </div>
    );
}