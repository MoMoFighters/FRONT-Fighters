import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
    getGroupStudyDailyRankingService,
    getGroupStudyDetailService,
    getGroupStudyMonthlyRankingService,
    getSentStudyInviteListService,
} from "@/app/services/study/service";
import GroupStudyRoomView from "@/components/study/GroupStudyRoomView";
import { getMyInfo } from "@/features/user/action";

export default async function GroupStudyRoomPage({
    params,
}: {
    params: Promise<{ roomId: string }>;
}) {
    const { roomId } = await params;
    const numericRoomId = Number(roomId);

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        redirect("/auth/login");
    }

    const [myInfoResponse, detailResponse, dailyRankingResponse, monthlyRankingResponse, sentInvitesResponse] = await Promise.all([
        getMyInfo(),
        getGroupStudyDetailService(numericRoomId),
        getGroupStudyDailyRankingService(numericRoomId),
        getGroupStudyMonthlyRankingService(numericRoomId),
        getSentStudyInviteListService(),
    ]);

    const myNickname = myInfoResponse.data?.nickname ?? null;

    if (!detailResponse.data) {
        redirect("/student/group-study");
    }

    const detail = detailResponse.data;
    const dailyRanking = dailyRankingResponse.data?.ranking ?? [];
    const monthlyRanking = monthlyRankingResponse.data?.ranking ?? [];
    const sentInvites = (sentInvitesResponse.data?.invitations ?? []).filter(
        (invite) => invite.roomId === numericRoomId
    );

    return (
        <GroupStudyRoomView
            roomId={numericRoomId}
            accessToken={accessToken}
            initialDetail={detail}
            myNickname={myNickname}
            dailyRanking={dailyRanking}
            monthlyRanking={monthlyRanking}
            initialSentInvites={sentInvites}
        />
    );
}
