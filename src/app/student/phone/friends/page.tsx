import ChatItem from "@/components/common/ChatItem";
import MessageInputBox from "@/features/phone/components/chat/MessageInputBox";
import FriendNav from "@/features/phone/components/friend/FriendNav";
import Image from "next/image";
import Link from "next/link";
import FriendItem from "@/components/phone/friends/FriendItem";

import { getChatRoomsService, getReceivedFriendRequestsService, getSentFriendRequestsService } from "@/app/services/phone/chat/service";
import ChatRoomArea from "@/components/common/ChatRoomArea";
import ChatRoomItem from "@/components/common/ChatRoomItem";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SearchFriendModal from "@/features/phone/components/friend/SearchFriendModal";
import { getMyInfo, MomoUserInfo, MomoUserInfoResponse } from "@/features/user/action";
import MyProfileDropdown from "@/features/phone/components/friend/MyProfileDropdown";

// interface ChatRoomInfo {
//     roomId: number;
//     userId: number;
//     nickname: string;
//     role: 'STUDENT' | 'TEACHER';
//     lectureTitle?: string;
//     content?: string | null;
//     unreadCount: number;


// }

type currentRoomId = number | null;
type accessToken = string | null


interface friendInfo {
    userId: number;
    nickname: string;
    status: 'SENT' | 'RECEIVED' | 'BLOCK' | "NONE" | "FRIEND";
    profileImageUrl: string;
}

export default async function StudentChatPage({
    searchParams
}: {
    searchParams: Promise<{ status?: string; roomId?: string }>
}) {

    const { status, roomId } = await searchParams
    const currentStatus = (status as 'friend' | 'request') ?? 'friend'
    const currentRoomId = roomId ? Number(roomId) : null


    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    console.log(accessToken)
    if (!accessToken) {
        redirect('/auth/login');
    }
    const myInfo: MomoUserInfoResponse = await getMyInfo();

    //데이터패칭 - 채팅방데이터
    const roomResponse = await getChatRoomsService(accessToken)
    if (roomResponse.status !== 200) {
        return
    }
    const chatRoomData = roomResponse?.data;

    //데이터패칭 - 친구 목록 데이터
    let received: friendInfo[] = [];
    let sent: friendInfo[] = [];
    const receivedResponse = await getReceivedFriendRequestsService(accessToken!);
    if (receivedResponse.status === 200) {
        received = receivedResponse.data ?? [];
    } else { return }

    const sentResponse = await getSentFriendRequestsService(accessToken!);
    if (sentResponse.status === 200) {
        sent = sentResponse.data ?? [];
    } else { return }


    return (
        <div className="flex flex-col mx-3 h-full">
            <FriendNav status={currentStatus} />
            <div className="flex flex-row overflow-hidden flex-1 min-h-0">
                <div className="border-r border-slate-200 flex flex-col min-h-0">

                    {/* 내 프로필 */}
                    <div className="p-5 flex flex-row gap-3 w-80 border-b border-slate-200">
                        <Image src={myInfo.data?.profileImageUrl || ""} alt="내 프로필" className="rounded-full flex justify-center my-auto" width={40} height={40}>

                        </Image>
                        <div className="flex flex-col gap-1 flex-1 align-middle justify-center">
                            <p className="font-bold text-md text-slate-900">{myInfo.data?.nickname} (나)</p>
                        </div>
                        <MyProfileDropdown myChatRoomId={chatRoomData?.[0]?.roomId} />
                    </div>

                    {/* 내 친구 목록에 해당하는 채팅방 나열 */}
                    <div className="flex flex-col overflow-y-scroll flex-1 min-h-0 scrollbar-none">
                        {/* {chatRoomData.map(data => (
                            <ChatRoomItem data={data} key={data.roomId} />
                        ))} */}
                        {chatRoomData?.length === 0 ? (
                            <div className="p-5 text-center text-sm text-slate-400 my-auto">
                                채팅방이 존재하지 않습니다.
                            </div>
                        ) : (
                            chatRoomData?.slice(1).map(data => (
                                <ChatRoomItem data={data} key={data.roomId} />
                            ))
                        )}
                    </div>

                </div>


                {currentStatus !== 'request' ? (
                    <div className="flex-1">
                        <ChatRoomArea currentRoomId={currentRoomId} accessToken={accessToken} isMine={currentRoomId === chatRoomData?.[0]?.roomId} />
                    </div>
                ) : (
                    <div className="p-3 flex flex-col gap-2 overflow-y-scroll w-full scrollbar-none">

                        <div className="">
                            <p className="mb-1 text-lg font-semibold">👤받은 친구 요청</p>
                            {/* 받은 친구 목록 나열 */}
                            <div className="flex flex-col gap-1">

                                {received.length ?
                                    received.map(friend => (
                                        <FriendItem friendInfo={{ name: friend.nickname, status: "RECEIVED", profile: friend.profileImageUrl, userId: friend.userId }} key={friend.userId} />
                                    )) : (
                                        <div className="w-max py-2 flex flex-row">
                                            <p className="text-xl text-slate-700 font-bold">❓받은 요청이 없습니다.</p>
                                        </div>
                                    )}
                            </div>
                        </div>

                        <div className="border-t border-slate-900">
                            <p className="mb-1 text-lg font-semibold mt-1">👤보낸 친구 요청</p>
                            {/* 보낸 친구 목록 나열 */}
                            <div className="flex flex-col gap-1">
                                {sent.length ? sent.map(friend => (
                                    <FriendItem friendInfo={{ name: friend.nickname, status: "SENT", profile: friend.profileImageUrl, userId: friend.userId }} key={friend.userId} />
                                )) : (
                                    <div className="w-max py-2 flex flex-row">
                                        <p className="text-xl text-slate-700 font-bold">❓보낸 요청이 없습니다.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

