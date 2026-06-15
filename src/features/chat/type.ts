// 채팅 관련

import { User, UserRole } from "../user/type";

export interface RoomInfo {
    roomId: number;
    roomTitle: string | null; //2인채팅 또는 나와의채팅
    memberInfo: ChatMemberResponse[]; //나 제외
    inMemberCount: number;  //나포함
}

// 채팅방 선택 후 메시지들 상세 조회
export interface ChatRoomResponse {
    roomInfo: RoomInfo;
    messages: Message[];    //20개씩 불러오는거, 마지막 메시지 정보를 같이 넘긴 경우 : 그거 제외 20개 과거꺼
}

// 채팅방 참가자 배열
export interface ChatMemberResponse {
    userId: number;
    name: string | null;    //강사일때는 nickname(name)
    role: 'STUENT' | "TEACHER";
    nickname: string;
    profileImageUrl: string;
    lectureTitle?: string | null;  //강의일 경우에만,          채팅방 제목 영역에 닉네임(이름)님과의 채팅 연하게 강의제목
    status: 'FRIEND' | 'BLOCK' | null;
}

// 채팅방 목록 조회
export interface ChatRoomListResponse {
    roomInfo: RoomInfo;

    content: string; //채팅목록에서 미리보기 메시지
    createdAt: string; //마지막 메시지가 전송된 시점
    unreadCount: number; //0도 있음
}

//말풍선 또는 방나감알림메시지 등등
export interface Message {
    messageId: number;  //type이 null이 아닐경우, 프론트측 처리로 key값에 랜덤값 임의로 더하기
    content: string;
    name: string | null;
    profileImageUrl: string | null;
    createdAt: string;
    role: UserRole | null;
    status: 'FRIEND' | 'BLOCK' | null;
    isMine: boolean;
    type: "INVITE" | "LEAVE" | "RENAME" | null;


    //unreadCount: number;
}



// 없앨래요..
export interface SendMessageResponse {
    roomId: number;
    userId: number;
    nickname: string;
    role: string;
    status: string;
    content: string;
    createdAt: string;
}




// // 2. 메시지 읽음 처리 타입
// export interface ReadMessageProps {
//     roomId: number;
//     accessToken: string;
// }

// export interface ReadMessageData {
//     roomId: number;
//     targetUserId?: number;
//     targetUseId?: number; // 백엔드 오타 대응
//     nickname: string;
//     isRead: boolean;
// }






// 4. 채팅방 목록


// 5. 채팅 내역 조회







