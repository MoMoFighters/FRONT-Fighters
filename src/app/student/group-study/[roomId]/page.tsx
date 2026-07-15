import { cookies } from "next/headers";

// TODO: 백엔드 준비되면 주석 해제
// import {
//     getGroupStudyDailyRankingService,
//     getGroupStudyDetailService,
//     getGroupStudyMonthlyRankingService,
// } from "@/app/services/study/service";
import GroupStudyRoomView from "@/components/study/GroupStudyRoomView";
import { getNicknameFromAccessToken } from "@/features/study/utils";
import type { GroupStudyDetail, StudyRankingEntry } from "@/features/study/type";

// 더미 목데이터 (서비스 연동 전까지 화면 확인용)
const MOCK_DETAIL: GroupStudyDetail = {
    roomId: 5,
    hostUserId: 8,
    hostNickname: "상희",
    status: "ACTIVE",
    maxMember: 4,
    members: [
        { userId: 8, nickname: "상희", status: "JOINED", timerStatus: "STUDYING" },
        { userId: 12, nickname: "민수", status: "JOINED", timerStatus: "RESTING" },
    ],
};

const MOCK_DAILY_RANKING: StudyRankingEntry[] = [
    { rank: 1, userId: 15, nickname: "지영", totalSeconds: 11560 },
    { rank: 2, userId: 22, nickname: "현우", totalSeconds: 7511 },
    { rank: 3, userId: 8, nickname: "상희", totalSeconds: 6002 },
];

const MOCK_MONTHLY_RANKING: StudyRankingEntry[] = [
    { rank: 1, userId: 8, nickname: "상희", totalSeconds: 302400 },
    { rank: 2, userId: 15, nickname: "지영", totalSeconds: 254880 },
    { rank: 3, userId: 12, nickname: "민수", totalSeconds: 198320 },
];

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

    // TODO: 백엔드 준비되면 주석 해제
    // const [detailResponse, dailyRankingResponse, monthlyRankingResponse] = await Promise.all([
    //     getGroupStudyDetailService(numericRoomId),
    //     getGroupStudyDailyRankingService(numericRoomId),
    //     getGroupStudyMonthlyRankingService(numericRoomId),
    // ]);

    const detail = MOCK_DETAIL;
    const dailyRanking = MOCK_DAILY_RANKING;
    const monthlyRanking = MOCK_MONTHLY_RANKING;

    return (
        <GroupStudyRoomView
            roomId={numericRoomId}
            initialDetail={detail}
            myNickname={myNickname}
            dailyRanking={dailyRanking}
            monthlyRanking={monthlyRanking}
        />
    );
}
