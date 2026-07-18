import { notFound, redirect } from "next/navigation";

import {
    getGroupStudyDailyRanking,
    getGroupStudyDetail,
    getGroupStudyMonthlyRanking,
    getSentStudyInviteList,
} from "@/features/study/actions";
import GroupStudyRoomView from "@/components/study/GroupStudyRoomView";
import { getMyInfo } from "@/features/user/action";

export default async function GroupStudyRoomPage({
    params,
}: {
    params: Promise<{ roomId: string }>;
}) {
    const { roomId } = await params;
    const numericRoomId = Number(roomId);

    const [detailResponse, sentInviteResponse, dailyRankingResponse, monthlyRankingResponse, myInfoResponse] =
        await Promise.all([
            getGroupStudyDetail(numericRoomId),
            getSentStudyInviteList(),
            getGroupStudyDailyRanking(numericRoomId),
            getGroupStudyMonthlyRanking(numericRoomId),
            getMyInfo(),
        ]);

    const myNickname = myInfoResponse.data?.nickname ?? null;

    if (detailResponse.statusCode === 401) {
        redirect("/auth/login");
    }

    if (detailResponse.statusCode === 404) {
        notFound();
    }

    if (detailResponse.statusCode >= 400 || !detailResponse.data) {
        // 403(참가자 아님) 등 그 외 실패는 목록으로 되돌려보낸다.
        redirect("/student/group-study");
    }

    const detail = detailResponse.data;
    const dailyRanking = dailyRankingResponse.data?.ranking ?? [];
    const monthlyRanking = monthlyRankingResponse.data?.ranking ?? [];
    const sentInvitations = (sentInviteResponse.data?.invitations ?? []).filter(
        (invitation) => invitation.roomId === numericRoomId
    );

    return (
        <GroupStudyRoomView
            roomId={numericRoomId}
            initialDetail={detail}
            myNickname={myNickname}
            dailyRanking={dailyRanking}
            monthlyRanking={monthlyRanking}
            initialSentInvitations={sentInvitations}
        />
    );
}
