import ChatItem from "@/components/common/ChatItem";
import ChatRoomItem from "@/components/common/ChatRoomItem";
import { Button } from "@/components/ui/button";
import MessageInputBox from "@/features/phone/chat/MessageInputBox";
import Image from "next/image";
import close from '@/app/assets/img/close.svg'

interface ChatRoomItemData {
    roomId: string;
    profile: string;
    name: string;
    recentMessage: string;
}

interface MessageData {
    isMine: boolean;
    message: string;
    time: string;
}

export default function ChatPage() {

    const data = {
        roomId: '1234',
        profile: 'string',
        name: '홍길동',
        recentMessage: '최근 메시지입니다.'
    } as ChatRoomItemData

    const chatRooms: ChatRoomItemData[] = [
        { roomId: '1', profile: 'string', name: '홍길동', recentMessage: '안녕하세요!' },
        { roomId: '2', profile: 'string', name: '김철수', recentMessage: '강의 잘 들었습니다.' },
        { roomId: '3', profile: 'string', name: '이영희', recentMessage: '감사합니다~' },
        { roomId: '4', profile: 'string', name: '박민준', recentMessage: '다음 강의는 언제인가요?' },
        { roomId: '5', profile: 'string', name: '최수진', recentMessage: '숙제 제출했어요!' },
        { roomId: '6', profile: 'string', name: '정다은', recentMessage: '오늘도 좋은 하루!' },
        { roomId: '7', profile: 'string', name: '강지훈', recentMessage: '질문 있어요' },
        { roomId: '8', profile: 'string', name: '윤서연', recentMessage: '잘 부탁드립니다.' },
    ]

    //searchParams로 넘겨서 데이터 받아오는게 나을듯 or /student/phone/friends/chat/[chatRoomId]
    const messages: MessageData[] = [
        { isMine: false, message: "안녕하세요!", time: "04:40" },
        { isMine: true, message: "네 안녕하세요~", time: "04:41" },
        { isMine: false, message: "오늘 강의 들으셨나요?", time: "04:41" },
        { isMine: true, message: "네 방금 들었어요!", time: "04:42" },
        { isMine: false, message: "어떠셨나요?", time: "04:42" },
        { isMine: true, message: "너무 좋았어요 감사합니다", time: "04:43" },
        { isMine: false, message: "다음 강의도 열심히 준비할게요", time: "04:43" },
        { isMine: true, message: "기대할게요!", time: "04:44" },
    ]

    return (
        <div className="flex flex-row h-full">
            <div className="flex flex-col w-70 overflow-hidden border-r border-slate-400 bg-slate-200">
                <div className="flex flex-row h-12 px-2 align-middle border-slate-400 border-b">
                    <p className="my-auto">쪽지(최신순)</p>
                    <div className="ml-auto flex-1 flex align-middle justify-end">
                        <p className="my-auto text-right">나와의 채팅</p>
                    </div>
                </div>
                <div className="flex flex-col overflow-y-scroll flex-1">
                    {chatRooms.map((room) => (
                        <ChatRoomItem data={room} key={room.roomId} />
                    ))}
                </div>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex flex-row py-2 px-4 border-b border-slate-400 bg-slate-200 h-12">
                    <p className="my-auto">{data.name}님과의 대화</p>
                    <div className="flex-1 ml-2">
                        <Button>나가기</Button>
                    </div>
                    <div className="flex justify-end">
                        <Image src={close} alt='닫기' className="h-8 w-8 cursor-pointer" />
                    </div>
                </div>
                <div className="flex flex-col gap-2 p-2 overflow-y-scroll max-h-full bg-mauve-200">
                    {messages.map((msg, index) => (
                        <ChatItem
                            key={index}
                            isMine={msg.isMine}
                            message={msg.message}
                            time={msg.time}
                        />
                    ))}
                </div>
                <MessageInputBox />
            </div>
        </div>
    );
}