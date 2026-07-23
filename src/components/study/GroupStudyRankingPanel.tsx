import {
    getGroupStudyDailyRankingService,
    getGroupStudyMonthlyRankingService,
} from "@/app/services/study/service";
import StudyRank from "./StudyRank";

export default async function GroupStudyRankingPanel({
    roomId,
}: {
    roomId: number;
}) {
    const [dailyRankingResponse, monthlyRankingResponse] = await Promise.all([
        getGroupStudyDailyRankingService(roomId),
        getGroupStudyMonthlyRankingService(roomId),
    ]);

    const dailyRanking = dailyRankingResponse.data?.ranking ?? [];
    const monthlyRanking = monthlyRankingResponse.data?.ranking ?? [];

    return (
        <StudyRank
            dailyRanking={dailyRanking}
            monthlyRanking={monthlyRanking}
        />
    );
}
