import { getChatRoomsService } from "@/app/services/phone/chat/service";
import ChatRoomArea from "@/components/common/ChatRoomArea";
import ChatRoomItem from "@/components/common/ChatRoomItem";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function TeacherAskPage({
    searchParams
}: {
    searchParams: Promise<{
        roomId?: string;
    }>
}) {

    const params =
        await searchParams;

    const currentRoomId =
        params.roomId
            ? Number(params.roomId)
            : null;

    // 토큰 조회
    const cookieStore =
        await cookies();

    const accessToken =
        cookieStore
            .get("accessToken")
            ?.value;

    // 미로그인
    if (!accessToken) {

        redirect("/auth/login");
    }

    // 채팅방 목록 조회
    const roomResponse =
        await getChatRoomsService(
            accessToken
        );

    if (
        roomResponse.status !== 200
    ) {

        return (
            <div>
                채팅방 조회 실패
            </div>
        );
    }

    const chatRoomData =
        roomResponse.data;

    return (
        <div className="flex flex-col p-12 h-148.5 max-w-6xl mx-auto">

            <div
                className="
                    flex
                    flex-row
                    border
                    border-slate-200
                    overflow-hidden
                    flex-1
                    min-h-0
                    bg-white
                "
            >

                {/* 채팅방 목록 */}
                <div
                    className="
                        flex
                        flex-col
                        overflow-y-scroll
                        min-h-0
                        w-80
                        shrink-0
                        scrollbar-none
                        border-r
                        border-slate-200
                    "
                >

                    {chatRoomData?.length === 0 ? (

                        <div
                            className="
                                p-5
                                text-center
                                text-sm
                                text-slate-400
                                my-auto
                            "
                        >
                            채팅방이 존재하지 않습니다.
                        </div>

                    ) : (

                        chatRoomData?.map(
                            (data) => (
                                <ChatRoomItem
                                    key={data.roomId}
                                    data={data}
                                />
                            )
                        )

                    )}

                </div>

                {/* 채팅창 */}
                <div
                    className="
                        flex-1
                        overflow-hidden
                    "
                >
                    <ChatRoomArea
                        currentRoomId={
                            currentRoomId
                        }
                        accessToken={
                            accessToken
                        }
                    />
                </div>

            </div>

        </div>
    );
}