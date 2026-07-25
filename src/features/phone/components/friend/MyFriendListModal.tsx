"use client";

import { useState } from "react";
import Image from "next/image";
import emptyStartGroupChat from "@/app/assets/img/empty-start-group-chat.svg";
import CreateGroupChatModal from "./CreateGroupChatModal";

// 채팅 상세 영역이 비어있을 때(채팅방 미선택) 보여주는 "단체 채팅 시작하기" 진입점.
// 실제 모달 내용은 CreateGroupChatModal에 공용으로 두고, 여기선 트리거만 담당한다.
export default function MyFriendListModal() {
    const [isModal, setIsModal] = useState(false);

    return (
        <>
            <Image
                src={emptyStartGroupChat}
                alt="단체 채팅 시작하기"
                width={140}
                height={140}
                className="cursor-pointer"
                onClick={() => setIsModal(true)}
            />

            <CreateGroupChatModal open={isModal} onOpenChange={setIsModal} />
        </>
    );
}
