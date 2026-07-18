import StudentPageHeader from "@/features/student/components/StudentPageHeader";
import {
    getCurrentSoloStudySessionService,
    getDailyStudyTimeService,
    getMonthlyStudyTimeService,
} from "@/app/services/study/service";
import { getThisYearMonthString, getTodayDateString } from "@/features/study/utils";
import { getMyInfo } from "@/features/user/action";
import SoloStudyView from "./SoloStudyView";

export default async function SoloStudyPage() {
    const today = new Date();

    const [currentSessionResponse, dailyTimeResponse, monthlyTimeResponse, myInfoResponse] =
        await Promise.all([
            getCurrentSoloStudySessionService(),
            getDailyStudyTimeService(getTodayDateString(today)),
            getMonthlyStudyTimeService(getThisYearMonthString(today)),
            getMyInfo(),
        ]);

    const myNickname = myInfoResponse.data?.nickname ?? null;

    return (
        <main className="min-h-[calc(100vh-137px)] bg-white px-8 py-8">
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
                myNickname={myNickname}
                initialSession={currentSessionResponse.data}
                dailyTotalSeconds={dailyTimeResponse.data?.totalSeconds ?? 0}
                monthlyTotalSeconds={monthlyTimeResponse.data?.totalSeconds ?? 0}
            />
        </main>
    );
}
