// 'use client'

// import Image from "next/image";
// import Link from "next/link";
// import close from '@/app/assets/img/close.svg'
// import ChatItem from "./ChatItem";
// import MessageInputBox from "@/features/phone/components/chat/MessageInputBox";
// import { usePathname } from "next/navigation";
// import { MessageCirclePlus } from "lucide-react";

// interface ChatItem {
//     id: number;
//     isMine: boolean;
//     content: string;
//     time: string;
// }


// export default function ChatRoomArea({ currentRoomId }: { currentRoomId: number | null }) {

//     // currentRoomId 로 상대방 이름 받아오기
//     const opponentName = `${currentRoomId} 홍길동`;
//     const pathname = usePathname();
//     console.log(pathname)
//     const href =
//         pathname.startsWith('/teacher')
//             ? "/teacher/ask"
//             : "/student/phone/friends";

//     // currentRoomId 로 메시지 정보 받아오기
//     const messages: ChatItem[] = [
//         {
//             id: 1,
//             isMine: false,
//             content: '안녕하세요!',
//             time: '4:44'
//         },
//         {
//             id: 2,
//             isMine: true,
//             content: '네 안녕하세요',
//             time: '4:44'
//         },
//         {
//             id: 3,
//             isMine: false,
//             content: '강의에서 이 내용은 뭐죠?',
//             time: '4:44'
//         },
//         {
//             id: 4,
//             isMine: true,
//             content: '그 부분은 말이죠',
//             time: '4:44'
//         },
//         {
//             id: 5,
//             isMine: true,
//             content: '공부를 하다보면 알게 되실 내용이라 일부러 말을 안 했는데',
//             time: '4:44'
//         },
//         {
//             id: 6,
//             isMine: true,
//             content: '나중에 4챕터에서 나옵니다',
//             time: '4:44'
//         },
//         {
//             id: 7,
//             isMine: true,
//             content: '간단히 알려드리자면',
//             time: '4:44'
//         },
//         {
//             id: 8,
//             isMine: true,
//             content: '1+1의 값을 2라고 도출하는 과정에서',
//             time: '4:44'
//         },
//         {
//             id: 9,
//             isMine: true,
//             content: '나오는 문제에 대한 이야기입니다.',
//             time: '4:44'
//         }
//     ]

//     if (!currentRoomId) {
//         return (
//             <div className="flex justify-center items-center align-middle h-full flex-col gap-2">
//                 <MessageCirclePlus className="h-12 w-12" />
//                 <p className="font-bold text-2xl">
//                     채팅방을 선택해주세요
//                 </p>
//             </div>
//         )
//     }
//     return (
//         <div className="flex flex-col h-full min-h-0">

// /* top bar (고정) *//*
// <div className="h-14 shrink-0 border-b border-slate-200 pl-2 py-2 flex flex-row items-center">

// <div className="flex-1 flex items-center gap-0">
// <p className="ml-2 text-lg font-semibold text-slate-900">
// {opponentName}
// </p>
// <p className="text-[12px] ml-1 font-semibold text-slate-500">
// 님과의 대화
// </p>
// </div>

// <Link href={href}>
// <Image src={close} alt="닫기" className="h-8 w-8 mr-1" />
// </Link>
// </div>

// /* messages (여기만 스크롤) */
// /*
// <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none p-2 flex flex-col gap-2">
//     {messages.map(message => (
//         <ChatItem
//             key={message.id}
//             id={message.id}
//             isMine={message.isMine}
//             message={message.content}
//             time={message.time}
//         />
//     ))}
// </div>
// <div className="shrink-0 border-t border-slate-200">
//     <MessageInputBox chatRoomId={currentRoomId} />
// </div>
// </div>
// );
// }
'use client'

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { MessageCirclePlus } from "lucide-react";

import close from '@/app/assets/img/close.svg';

import ChatItem from "./ChatItem";
import MessageInputBox from "@/features/phone/components/chat/MessageInputBox";
import { ChatMessage, getChatHistoryService } from "@/app/services/phone/chat/service";


interface ChatRoomAreaProps {
    currentRoomId: number | null;
    accessToken: string;
}

export default function ChatRoomArea({
    currentRoomId,
    accessToken,
}: ChatRoomAreaProps) {

    const pathname = usePathname();

    const [messages, setMessages] =
        useState<ChatMessage[]>([]);

    const href =
        pathname.startsWith('/teacher')
            ? '/teacher/ask'
            : '/student/phone/friends';

    useEffect(() => {

        if (!currentRoomId) {

            setMessages([]);
            return;
        }

        const loadMessages = async () => {

            try {

                const response =
                    await getChatHistoryService({
                        roomId: currentRoomId,
                        accessToken,
                    });

                setMessages(
                    response.data ?? []
                );

            } catch (error) {

                console.error(error);

                setMessages([]);
            }
        };

        loadMessages();

    }, [
        currentRoomId,
        accessToken,
    ]);

    if (!currentRoomId) {

        return (
            <div
                className="
                    flex
                    justify-center
                    items-center
                    h-full
                    flex-col
                    gap-2
                "
            >
                <MessageCirclePlus
                    className="h-12 w-12"
                />

                <p
                    className="
                        font-bold
                        text-2xl
                    "
                >
                    채팅방을 선택해주세요
                </p>
            </div>
        );
    }

    const opponentName =
        messages[0]?.nickname ??
        '채팅방';

    return (
        <div className="flex flex-col h-full min-h-0">

            {/* 상단바 */}
            <div
                className="
                    h-14
                    shrink-0
                    border-b
                    border-slate-200
                    pl-2
                    py-2
                    flex
                    flex-row
                    items-center
                "
            >
                <div
                    className="
                        flex-1
                        flex
                        items-center
                    "
                >
                    <p
                        className="
                            ml-2
                            text-lg
                            font-semibold
                            text-slate-900
                        "
                    >
                        {opponentName}
                    </p>

                    <p
                        className="
                            text-[12px]
                            ml-1
                            font-semibold
                            text-slate-500
                        "
                    >
                        님과의 대화
                    </p>
                </div>

                <Link href={href}>
                    <Image
                        src={close}
                        alt="닫기"
                        className="h-8 w-8 mr-1"
                    />
                </Link>
            </div>

            {/* 채팅 영역 */}
            <div
                className="
                    flex-1
                    min-h-0
                    overflow-y-auto
                    scrollbar-none
                    p-2
                    flex
                    flex-col
                    gap-2
                "
            >
                {
                    messages.length === 0 ? (

                        <div
                            className="
                                flex
                                justify-center
                                items-center
                                h-full
                            "
                        >
                            <p
                                className="
                                    text-slate-400
                                "
                            >
                                아직 채팅 내역이 없습니다.
                            </p>
                        </div>

                    ) : (

                        messages.map(message => (

                            <ChatItem
                                key={
                                    message.messageId
                                }

                                id={
                                    message.messageId
                                }

                                isMine={
                                    message.isMine
                                }

                                message={
                                    message.content
                                }

                                time={
                                    new Date(
                                        message.createdAt
                                    ).toLocaleTimeString(
                                        'ko-KR',
                                        {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        }
                                    )
                                }
                            />

                        ))

                    )
                }
            </div>

            {/* 입력창 */}
            <div
                className="
                    shrink-0
                    border-t
                    border-slate-200
                "
            >
                <MessageInputBox
                    chatRoomId={
                        currentRoomId
                    }
                />
            </div>

        </div>
    );
}