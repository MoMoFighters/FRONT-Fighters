import StudentPageHeader from "@/features/student/components/StudentPageHeader";
import {
    getCurrentSoloStudySessionService,
    getDailyStudyTimeService,
    getMonthlyStudyTimeService,
    getYearlyStudyRecordService,
} from "@/app/services/study/service";
import {
    getThisYearMonthString,
    getTodayDateString,
} from "@/features/study/utils";
import SoloStudyView from "./SoloStudyView";

export default async function SoloStudyPage() {
    const today = new Date();

    const [currentSessionResponse, dailyTimeResponse, monthlyTimeResponse, yearlyRecordResponse] = await Promise.all([
        getCurrentSoloStudySessionService(),
        getDailyStudyTimeService(getTodayDateString(today)),
        getMonthlyStudyTimeService(getThisYearMonthString(today)),
        getYearlyStudyRecordService(),
    ]);

    const recordSecondsByDate = new Map(
        (yearlyRecordResponse.data?.records ?? []).map((record) => [record.date, record.totalSeconds])
    );

    // 오늘부터 거꾸로 훑으면서 연속으로 공부한 일수를 계산
    let streakDays = 0;
    const streakCursor = new Date(today);

    while (true) {
        const dateStr = getTodayDateString(streakCursor);
        const seconds = recordSecondsByDate.get(dateStr) ?? 0;

        if (seconds <= 0) {
            break;
        }

        streakDays += 1;
        streakCursor.setDate(streakCursor.getDate() - 1);
    }

    // 최근 7일(오늘 포함) 공부량 - 오래된 날짜부터 순서대로
    const weeklyRecords = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (6 - index));
        const dateStr = getTodayDateString(date);

        return {
            date: dateStr,
            totalSeconds: recordSecondsByDate.get(dateStr) ?? 0,
        };
    });

    return (
        <main className="min-h-[calc(100vh-137px)] bg-white px-4 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto w-full max-w-360">
                <StudentPageHeader
                    backHref="/student/group-study"
                    breadcrumbs={[
                        {
                            label: "홈",
                            href: "/student",
                        },
                        {
                            label: "팀 스터디",
                            href: "/student/group-study",
                        },
                        {
                            label: "혼자 공부하기",
                        },
                    ]}
                    title="혼자 공부하기"
                />
            </div>

            <SoloStudyView
                initialSession={currentSessionResponse.data}
                dailyTotalSeconds={dailyTimeResponse.data?.totalSeconds ?? 0}
                monthlyTotalSeconds={monthlyTimeResponse.data?.totalSeconds ?? 0}
                streakDays={streakDays}
                weeklyRecords={weeklyRecords}
            />
        </main>
    );
}
