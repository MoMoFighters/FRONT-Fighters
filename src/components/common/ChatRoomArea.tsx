'use client'

import Image from "next/image";
import Link from "next/link";
import close from '@/app/assets/img/close.svg'
import ChatItem from "./ChatItem";
import MessageInputBox from "@/features/phone/components/chat/MessageInputBox";

interface ChatItem {
    id: number;
    isMine: boolean;
    content: string;
    time: string;
}


export default function ChatRoomArea({ currentRoomId }: { currentRoomId: number }) {

    // currentRoomId 로 상대방 이름 받아오기
    const opponentName = `${currentRoomId} 홍길동`;

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

    return (
        <div className="flex-1 flex flex-col">
            <div className="h-14 border-b border-slate-200 pl-2 py-2 flex flex-row align-middle ">
                {/* 채팅방 탑바 */}
                <div className="flex-1 flex align-middle gap-0">
                    {/* search파람스 받아오기 */}
                    <p className="mt-1.5 ml-2 text-lg font-semibold text-slate-900">{opponentName}</p>
                    <p className="mt-4 text-[12px] ml-1 font-semibold text-slate-500">님과의 대화</p>
                </div>
                <Link href="/student/phone/friends">
                    <Image src={close} alt='닫기' className="h-8 w-8 my-auto mr-1" />
                </Link>
            </div>
            <div className="flex flex-col gap-2 flex-1 overflow-y-scroll scrollbar-none p-2">
                {messages.map(message => (<ChatItem isMine={message.isMine} message={message.content} time={message.time} id={message.id} key={message.id} />))}
            </div>
            <MessageInputBox chatRoomId={Number(currentRoomId)} />
        </div>
    );
}