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

    const cookieStore =
        await cookies();

    const accessToken =
        cookieStore
            .get("accessToken")
            ?.value;

    if (!accessToken) {

        redirect("/auth/login");
    }

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
        <div className="flex flex-col h-160 max-w-6xl mx-auto my-3 w-full">

            <div
                className="flex flex-col border border-slate-200 overflow-hidden flex-1 min-h-0 bg-white md:flex-row"
            >

                <div
                    className="flex flex-col overflow-y-scroll min-h-0 w-full shrink-0 scrollbar-none border-r border-slate-200 md:w-80"
                >

                    {chatRoomData?.length === 0 ? (

                        <div
                            className="p-5 text-center text-sm text-slate-400 my-auto"
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

                <div
                    className="flex-1 overflow-hidden"
                >
                    <ChatRoomArea
                        currentRoomId={
                            currentRoomId
                        }
                        accessToken={
                            accessToken
                        }
                        isMine={false}
                    />
                </div>

            </div>

        </div>
    );
}
