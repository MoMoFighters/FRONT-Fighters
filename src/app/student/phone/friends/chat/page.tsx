import ChatRoomItem from "@/components/common/ChatRoomItem";

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
            <div className="flex flex-col w-70 overflow-hidden">
                <div className="flex flex-row h-12 px-2 align-middle">
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
            <div className="flex-1">

            </div>
        </div>
    );
}