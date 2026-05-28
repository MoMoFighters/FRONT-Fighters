/*import ChatRoomArea from "@/components/common/ChatRoomArea";
import ChatRoomItem from "@/components/common/ChatRoomItem";

interface ChatRoomInfo {
    roomId: number;
    userId: number;
    nickname: string;
    role: 'student' | 'teacher';
    lectureTitle?: string;
    content?: string | null;
    unreadCount: number;
}

interface Props {
    currentRoomId: number | null;
}

export default async function TeacherAskPage({
    searchParams
}: {
    searchParams: Promise<{
        roomId?: string
    }>
}) {

    const params = await searchParams;

    const roomId = params.roomId;
    const currentRoomId =
        roomId ? Number(roomId) : null;

    console.log(roomId)
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

    return (
        <div className="flex flex-row p-12 border border-slate-200 overflow-hidden h-148.5">
            <div className="flex flex-col overflow-hidden overflow-y-scroll min-h-0 scrollbar-none border border-slate-200">
                {chatRoomData.map(data => (
                    <ChatRoomItem data={data} key={data.roomId} />
                ))}
            </div>
            <div className="border-y border-r overflow-hidden border-slate-200 flex-1 h-auto">
                <ChatRoomArea currentRoomId={currentRoomId} />
            </div>
        </div>
    );
}*/
import { getChatRoomsService } from "@/app/services/phone/chat/service";
import ChatRoomArea from "@/components/common/ChatRoomArea";
import ChatRoomItem from "@/components/common/ChatRoomItem";
import { cookies } from "next/headers";

interface ChatRoomInfo {
    roomId: number;
    userId: number;
    nickname: string;
    role: 'student' | 'teacher';
    lectureTitle?: string;
    content?: string | null;
    unreadCount: number;
    createdAt?: string;
}

export default async function TeacherAskPage({
    searchParams
}: {
    searchParams: Promise<{ roomId?: string }>
}) {
    const params = await searchParams;
    const roomId = params.roomId;
    const currentRoomId = roomId ? Number(roomId) : null;

    // 1. 쿠키에서 토큰 꺼내기
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value || "";

    // 2. [GET] /api/v1/messages/rooms API를 통해 자동으로 개설되어 있는 방 목록 조회
    let chatRoomData: ChatRoomInfo[] = [];

    try {
        if (accessToken) {
            const response = await getChatRoomsService({ accessToken });
            if (response.success) {
                // 백엔드 명세서 규격에 맞게 매핑
                chatRoomData = response.data.map((room) => ({
                    roomId: room.roomId,
                    userId: room.userId,
                    nickname: room.nickname,
                    // 백엔드가 대문자로 줄 경우를 대비해 소문자 포맷팅
                    role: room.role.toLowerCase() as 'student' | 'teacher',
                    lectureTitle: room.lectureTitle,
                    content: room.content,
                    unreadCount: room.unreadCount,
                    createdAt: room.createdAt
                }));
            }
        }
    } catch (error) {
        console.error("채팅방 목록 로드 실패:", error);
        // 실패 시 가짜 Mock 데이터나 빈 배열 처리
    }

    // 만약 데이터가 없을 때 백엔드 가이드("채팅을 시작한 친구가 없어요...") 처리용 조건부 렌더링도 가능합니다.

    return (
        <div className="flex flex-col p-12 h-148.5 max-w-6xl mx-auto">

            {/* 메인 컨텐츠 영역 */}
            <div className="flex flex-row border border-slate-200 overflow-hidden flex-1 min-h-0 bg-white">

                {/* 왼쪽: 자동으로 생성되어 있는 채팅방 리스트 */}
                <div className="flex flex-col overflow-hidden overflow-y-scroll min-h-0 w-80 shrink-0 scrollbar-none border-r border-slate-200">
                    {chatRoomData.length === 0 ? (
                        <div className="p-5 text-center text-sm text-slate-400 my-auto">
                            채팅방이 존재하지 않습니다.
                        </div>
                    ) : (
                        chatRoomData.map(data => (
                            <ChatRoomItem data={data} key={data.roomId} />
                        ))
                    )}
                </div>

                {/* 오른쪽: 선택된 채팅방 상세 내역 Area */}
                <div className="overflow-hidden flex-1 h-auto">
                    <ChatRoomArea currentRoomId={currentRoomId} />
                </div>
            </div>
        </div>
    );
}