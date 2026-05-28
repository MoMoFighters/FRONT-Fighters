/*'use client'

import Image from "next/image";
import Link from "next/link";
import close from '@/app/assets/img/close.svg'
import ChatItem from "./ChatItem";
import MessageInputBox from "@/features/phone/components/chat/MessageInputBox";
import { usePathname } from "next/navigation";
import { MessageCirclePlus } from "lucide-react";

interface ChatItem {
    id: number;
    isMine: boolean;
    content: string;
    time: string;
}


export default function ChatRoomArea({ currentRoomId }: { currentRoomId: number | null }) {

    // currentRoomId 로 상대방 이름 받아오기
    const opponentName = `${currentRoomId} 홍길동`;
    const pathname = usePathname();
    console.log(pathname)
    const href =
        pathname.startsWith('/teacher')
            ? "/teacher/ask"
            : "/student/phone/friends";

    // currentRoomId 로 메시지 정보 받아오기
    const messages: ChatItem[] = [
        {
            id: 1,
            isMine: false,
            content: '안녕하세요!',
            time: '4:44'
        },
        {
            id: 2,
            isMine: true,
            content: '네 안녕하세요',
            time: '4:44'
        },
        {
            id: 3,
            isMine: false,
            content: '강의에서 이 내용은 뭐죠?',
            time: '4:44'
        },
        {
            id: 4,
            isMine: true,
            content: '그 부분은 말이죠',
            time: '4:44'
        },
        {
            id: 5,
            isMine: true,
            content: '공부를 하다보면 알게 되실 내용이라 일부러 말을 안 했는데',
            time: '4:44'
        },
        {
            id: 6,
            isMine: true,
            content: '나중에 4챕터에서 나옵니다',
            time: '4:44'
        },
        {
            id: 7,
            isMine: true,
            content: '간단히 알려드리자면',
            time: '4:44'
        },
        {
            id: 8,
            isMine: true,
            content: '1+1의 값을 2라고 도출하는 과정에서',
            time: '4:44'
        },
        {
            id: 9,
            isMine: true,
            content: '나오는 문제에 대한 이야기입니다.',
            time: '4:44'
        }
    ]

    if (!currentRoomId) {
        return (
            <div className="flex justify-center items-center align-middle h-full flex-col gap-2">
                <MessageCirclePlus className="h-12 w-12" />
                <p className="font-bold text-2xl">
                    채팅방을 선택해주세요
                </p>
            </div>
        )
    }
    return (
        <div className="flex flex-col h-full min-h-0">

            /* top bar (고정) *//*
<div className="h-14 shrink-0 border-b border-slate-200 pl-2 py-2 flex flex-row items-center">

<div className="flex-1 flex items-center gap-0">
<p className="ml-2 text-lg font-semibold text-slate-900">
{opponentName}
</p>
<p className="text-[12px] ml-1 font-semibold text-slate-500">
님과의 대화
</p>
</div>

<Link href={href}>
<Image src={close} alt="닫기" className="h-8 w-8 mr-1" />
</Link>
</div>

/* messages (여기만 스크롤) */
/*
<div className="flex-1 min-h-0 overflow-y-auto scrollbar-none p-2 flex flex-col gap-2">
    {messages.map(message => (
        <ChatItem
            key={message.id}
            id={message.id}
            isMine={message.isMine}
            message={message.content}
            time={message.time}
        />
    ))}
</div>
<div className="shrink-0 border-t border-slate-200">
    <MessageInputBox chatRoomId={currentRoomId} />
</div>
</div>
);
}
*/
'use client'

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import close from '@/app/assets/img/close.svg';
import ChatItem from "./ChatItem";
import MessageInputBox from "@/features/phone/components/chat/MessageInputBox";
import { usePathname } from "next/navigation";
import { MessageCirclePlus } from "lucide-react";
import { getSocket } from "@/lib/socket";
import axios from "axios";
import { readMessageAction } from "@/features/phone/chatAction";

interface MessageType {
    messageId: number;
    senderId: number;
    nickname: string;
    content: string;
    createdAt: string;
    isRead: boolean;
    isMine: boolean;
}

export default function ChatRoomArea({ currentRoomId }: { currentRoomId: number | null }) {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [opponentName, setOpponentName] = useState<string>("");
    const messageEndRef = useRef<HTMLDivElement>(null);

    const pathname = usePathname();

    // 임시 토큰 설정 (실제 프로젝트 구조에 맞게 쿠키나 세션에서 관리하는 토큰 값으로 대체하세요)
    const accessToken = "eyJhbGciOi...";

    const href = pathname.startsWith('/teacher') ? "/teacher/ask" : "/student/phone/friends";

    useEffect(() => {
        if (!currentRoomId) return;

        // ==========================================
        // 1. [Server Action] 방 진입 시 즉시 읽음 처리 수행
        // ==========================================
        readMessageAction(currentRoomId)
            .then((res) => {
                if (res.success) {
                    console.log("서버 디비 읽음 처리 성공:", res.message);
                }
            })
            .catch((err) => console.error("읽음 처리 액션 에러:", err));

        // ==========================================
        // 2. [HTTP API] 해당 방의 과거 대화 내역 20개 조회
        // ==========================================
        axios.get(`http://localhost:8080/api/v1/messages/history/${currentRoomId}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
            .then((res) => {
                if (res.data.success) {
                    setMessages(res.data.data);

                    // 대화상대방 이름 식별 가공 (내가 아닌 상대방 닉네임 찾기)
                    const opponent = res.data.data.find((msg: MessageType) => !msg.isMine);
                    setOpponentName(opponent ? opponent.nickname : "상대방");
                }
            })
            .catch((err) => {
                console.error("채팅 내역 불러오기 실패:", err);
            });

        // ==========================================
        // 3. [Socket.io] 실시간 소켓 연결 및 수신부 작동
        // ==========================================
        const socket = getSocket(accessToken);

        if (!socket.connected) {
            socket.connect();
        }

        // 해당 채팅방 고유 룸(Room)에 입장 신호 전송
        socket.emit("join_room", { roomId: currentRoomId });

        // 실시간 새 메시지 핸들러 등록
        socket.on("new_message", (incomingData: MessageType) => {
            // 현재 화면에 말풍선 즉시 추가
            setMessages((prev) => [...prev, incomingData]);

            // 이미 유저가 대화방 창을 눈으로 켜두고 보고 있는 상태이므로, 
            // 실시간으로 들어오는 메시지도 즉시 DB 읽음 처리를 맞춰주기 위해 액션 조용히 호출
            readMessageAction(currentRoomId);
        });

        // 컴포넌트 해제되거나 방 바뀔 때 클린업 
        return () => {
            socket.emit("leave_room", { roomId: currentRoomId });
            socket.off("new_message");
        };
    }, [currentRoomId, accessToken]);

    // 새로운 대화가 추가되거나 갱신되면 최하단 스크롤 이동
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 방이 선택되지 않았을 때 기본 가이드 UI
    if (!currentRoomId) {
        return (
            <div className="flex justify-center items-center align-middle h-full flex-col gap-2">
                <MessageCirclePlus className="h-12 w-12 text-slate-400" />
                <p className="font-bold text-2xl text-slate-700">
                    채팅방을 선택해주세요
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full min-h-0">

            {/* 상단 툴바 고정 영역 */}
            <div className="h-14 shrink-0 border-b border-slate-200 pl-2 py-2 flex flex-row items-center bg-white">
                <div className="flex-1 flex items-center gap-0">
                    <p className="ml-2 text-lg font-semibold text-slate-900">
                        {opponentName}
                    </p>
                    <p className="text-[12px] ml-1 font-semibold text-slate-500">
                        님과의 대화
                    </p>
                </div>

                <Link href={href}>
                    <Image src={close} alt="닫기" className="h-8 w-8 mr-1" />
                </Link>
            </div>

            {/* 메시지 리스트 스크롤 영역 */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none p-2 flex flex-col gap-2 bg-slate-50">
                {messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-slate-400 text-sm">
                        대화 기록이 없어요. 대화를 시작해보세요!
                    </div>
                ) : (
                    messages.map((message) => (
                        <ChatItem
                            key={message.messageId}
                            id={message.messageId}
                            isMine={message.isMine}
                            message={message.content}
                            time={new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                        />
                    ))
                )}
                {/* 자동 스크롤 추적용 Anchor 고정 태그 */}
                <div ref={messageEndRef} />
            </div>

            {/* 메시지 타이핑 및 전송 인풋 컴포넌트 */}
            <div className="shrink-0 border-t border-slate-200">
                <MessageInputBox chatRoomId={currentRoomId} />
            </div>
        </div>
    );
}