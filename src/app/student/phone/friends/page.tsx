import ChatItem from "@/components/common/ChatItem";
import MessageInputBox from "@/features/phone/components/chat/MessageInputBox";
import FriendNav from "@/features/phone/components/friend/FriendNav";
import Image from "next/image";
import Link from "next/link";
import ChatRoomItem from "@/components/common/ChatRoomItem";
import FriendItem from "@/components/phone/friends/FriendItem";
import ChatRoomArea from "@/components/common/ChatRoomArea";

interface ChatRoomInfo {
    roomId: number;
    userId: number;
    nickname: string;
    role: 'student' | 'teacher';
    lectureTitle?: string;
    content?: string | null;
    unreadCount: number;
}

interface friendInfo {
    userId: number;
    name: string;
    status: 'sent' | 'recieved' | 'block';
    profile: string;
}

export default async function SearchUserListPage({
    searchParams
}: {
    searchParams: Promise<{ status?: string; roomId?: string }>
}) {

    const { status, roomId } = await searchParams
    const currentStatus = (status as 'friend' | 'request') ?? 'friend'
    const currentRoomId = roomId ? Number(roomId) : null

    //데이터 패칭 - chatroom(roomId,userId,content,unreadCount)
    const chatRoomData: ChatRoomInfo[] = [
        { userId: 1, nickname: '김철수', role: 'student', roomId: 101, content: '안녕하세요!', unreadCount: 3 },
        { userId: 2, nickname: '이영희', role: 'student', roomId: 102, content: '과제 언제까지예요?', unreadCount: 1 },
        { userId: 3, nickname: '박민준', role: 'teacher', lectureTitle: 'React 심화반', roomId: 103, content: '강의 자료 올려드렸습니다.', unreadCount: 5 },
        { userId: 4, nickname: '최수진', role: 'student', roomId: 104, content: null, unreadCount: 0 },
        { userId: 5, nickname: '정호준', role: 'teacher', lectureTitle: 'Spring Boot 입문', roomId: 105, content: '질문 남겨주세요!', unreadCount: 0 },
        { userId: 6, nickname: '한지민', role: 'student', roomId: 106, content: '감사합니다 :)', unreadCount: 2 },
        { userId: 7, nickname: '윤서연', role: 'teacher', lectureTitle: 'Next.js 실전', roomId: 107, content: null, unreadCount: 0 },
        { userId: 8, nickname: '강동현', role: 'student', roomId: 108, content: '확인했습니다!', unreadCount: 0 },
        { userId: 9, nickname: '임나영', role: 'teacher', lectureTitle: 'TypeScript 기초', roomId: 109, content: '다음 강의는 목요일입니다.', unreadCount: 7 },
        { userId: 10, nickname: '송재원', role: 'student', roomId: 110, content: null, unreadCount: 0 },
    ]

    //데이터패칭 - 친구 목록 데이터(상태관련)
    const users: friendInfo[] = [
        { userId: 1, name: '김철수', status: 'sent', profile: '김' },
        { userId: 2, name: '이영희', status: 'recieved', profile: '이' },
        { userId: 3, name: '박민준', status: 'block', profile: '박' },
        { userId: 4, name: '최수진', status: 'sent', profile: '최' },
        { userId: 5, name: '정호준', status: 'recieved', profile: '정' },
        { userId: 6, name: '한지민', status: 'sent', profile: '한' },
        { userId: 7, name: '윤서연', status: 'block', profile: '윤' },
        { userId: 8, name: '강동현', status: 'recieved', profile: '강' },
        { userId: 9, name: '임나영', status: 'sent', profile: '임' },
        { userId: 10, name: '송재원', status: 'block', profile: '송' },
        { userId: 11, name: '오지훈', status: 'recieved', profile: '오' },
        { userId: 12, name: '배수현', status: 'sent', profile: '배' },
        { userId: 13, name: '신동엽', status: 'block', profile: '신' },
        { userId: 14, name: '황민서', status: 'recieved', profile: '황' },
        { userId: 15, name: '류지아', status: 'sent', profile: '류' },
    ]

    return (
        <div className="flex flex-col mx-3 h-full overflow-hidden">
            <FriendNav status={currentStatus} />
            <div className="flex flex-row overflow-hidden flex-1 min-h-0">
                <div className="border-r border-slate-200 flex flex-col min-h-0">

                    {/* 내 프로필 */}
                    <div className="p-5 flex flex-row gap-3 w-80 border-b border-slate-200">
                        <div className="rounded-full bg-pink-100 w-10 h-10 flex justify-center my-auto">
                            <p className="my-auto font-bold">홍</p>
                        </div>
                        <div className="flex flex-col gap-1 flex-1 align-middle">
                            <p className="font-bold text-md text-slate-900">홍길동 (나)</p>
                            <p className="text-sm text-slate-400">최근 메시지입니다.</p>
                        </div>
                        <div>
                            ...
                        </div>
                    </div>

                    {/* 내 친구 목록에 해당하는 채팅방 나열 */}
                    <div className="flex flex-col overflow-y-scroll flex-1 min-h-0 scrollbar-none">
                        {chatRoomData.map(data => (
                            <ChatRoomItem data={data} key={data.roomId} />
                        ))}
                    </div>

                </div>


                {currentStatus !== 'request' ? (
                    currentRoomId ? (<ChatRoomArea currentRoomId={currentRoomId} />
                    ) : ""
                ) : (
                    <div className="p-3 flex flex-col gap-2 overflow-y-scroll w-full scrollbar-none">

                        <div className="flex flex-col">
                            <p className="mb-1 text-lg font-semibold">받은 친구 요청</p>
                            {/* 받은 친구 목록 나열 */}
                            <div className="flex flex-col gap-1">
                                {users.filter(item => item.status === "recieved").map(friend => (
                                    <FriendItem friendInfo={{ name: friend.name, status: "recieved", profile: friend.profile, userId: friend.userId }} key={friend.userId} />
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="mb-1 text-lg font-semibold mt-1">보낸 친구 요청</p>
                            {/* 보낸 친구 목록 나열 */}
                            <div className="flex flex-col gap-1">
                                {users.filter(item => item.status === "sent").map(friend => (
                                    <FriendItem friendInfo={{ name: friend.name, status: "sent", profile: friend.profile, userId: friend.userId }} key={friend.userId} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}