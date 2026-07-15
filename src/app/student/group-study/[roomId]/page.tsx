import { cookies } from "next/headers";

import {
    getGroupStudyDailyRankingService,
    getGroupStudyDetailService,
    getGroupStudyMonthlyRankingService,
} from "@/app/services/study/service";
import { getNicknameFromAccessToken } from "@/features/study/utils";
import GroupStudyRoomView from "./GroupStudyRoomView";

export default async function GroupStudyRoomPage({
    params,
}: {
    params: Promise<{ roomId: string }>;
}) {
    const { roomId } = await params;
    const numericRoomId = Number(roomId);

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const myNickname = getNicknameFromAccessToken(accessToken);

    const [detailResponse, dailyRankingResponse, monthlyRankingResponse] = await Promise.all([
        getGroupStudyDetailService(numericRoomId),
        getGroupStudyDailyRankingService(numericRoomId),
        getGroupStudyMonthlyRankingService(numericRoomId),
    ]);

    return (
        <GroupStudyRoomView
            roomId={numericRoomId}
            initialDetail={detailResponse.data}
            myNickname={myNickname}
            dailyRanking={dailyRankingResponse.data?.ranking ?? []}
            monthlyRanking={monthlyRankingResponse.data?.ranking ?? []}
        />
    );
}
