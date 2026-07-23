import { Suspense } from "react";
import Phone from "@/components/city/Phone";
import MonthlyStreakGarden from "@/components/city/MonthlyStreakGarden";
import BusStation from "@/components/city/BusStation";
import PostBoard from "@/components/city/PostBoard";
import CityCanvas from "@/components/city/CityCanvas";
import StudentCityBuildings from "@/components/city/StudentCityBuildings";
import FortuneSpot from "@/features/city/components/FortuneSpot";
import FloatingGrassButton from "@/components/city/FloatingGrassButton";
import MobileBuildingItem from "@/components/city/MobileBuildingItem";
import MobileTextItem from "@/components/city/MobileTextItem";
import { cookies } from "next/headers";
import { getMyBuildings, getMyStreak } from "../services/city/service";
import { getMyInfo } from "@/features/user/action";
import NicknameInputModal from "@/features/auth/components/NicknameInputModal";
import { buildActivityGrassMap } from "@/features/city/utils";
import type { GrassLevel } from "@/components/mypage/GrassHeatmap";

const MOBILE_GRASS_COLOR_SCALE: Record<GrassLevel, string> = {
    0: "bg-slate-100",
    1: "bg-indigo-200",
    2: "bg-indigo-400",
    3: "bg-indigo-600",
    4: "bg-indigo-800",
};

const BUILDING_POSITIONS = [1, 2, 3, 4, 5] as const;

export default async function StudentMainPage() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const myInfo = await getMyInfo();
    const dnd = myInfo.data?.doNotDisturb;

    return (
        <>
            {!myInfo.data?.nickname &&
                <NicknameInputModal />
            }

            {/* 태블릿+데스크탑(md 이상): 기존 도시 배경 그대로 */}
            <div className="hidden h-full md:block">
                <CityCanvas>
                    <BusStation mode="MY" />
                    <PostBoard mode="MY" />
                    <Phone accessToken={accessToken} initialNotification={dnd} />
                    <Suspense fallback={null}>
                        <StreakSection />
                    </Suspense>
                    <Suspense fallback={null}>
                        <BuildingsSection />
                    </Suspense>
                    <FortuneSpot />
                </CityCanvas>
            </div>

            {/* 모바일(md 미만): 도시 배경 대신 리스트형 레이아웃 */}
            <div className="block md:hidden">
                <div className="min-h-screen bg-white px-4 py-6 pb-24">
                    <p className="mb-4 text-right text-xs font-medium text-slate-400">
                        모바일에서는 건물의 위치를 지정할 수 없습니다.
                    </p>

                    <Suspense fallback={null}>
                        <MobileBuildingsSection />
                    </Suspense>

                    <div className="mt-4 space-y-3">
                        <MobileTextItem
                            title="마이페이지"
                            description="마이페이지로 이동합니다."
                            href="/student/mypage"
                        />
                        <MobileTextItem
                            title="팀 스터디"
                            description="그룹 스터디로 이동합니다."
                            href="/student/group-study"
                        />
                        <MobileTextItem
                            title="포인트 상점"
                            description="포인트 상점으로 이동합니다."
                            href="/student/point-store"
                        />
                        <BusStation mode="MY" variant="mobile" />
                        <FortuneSpot variant="mobile" />
                        <PostBoard mode="MY" variant="mobile" />
                    </div>
                </div>

                <Suspense fallback={null}>
                    <MobileGrassButtonSection />
                </Suspense>
            </div>
        </>
    );
}

async function StreakSection() {
    const monthlyStreak = await getMyStreak();

    return <MonthlyStreakGarden initialStreak={monthlyStreak} />;
}

async function BuildingsSection() {
    const buildings = await getMyBuildings();

    return <StudentCityBuildings initialBuildings={buildings} />;
}

async function MobileBuildingsSection() {
    const buildings = await getMyBuildings();

    return (
        <div className="grid grid-cols-1 gap-3">
            {BUILDING_POSITIONS.map((position) => {
                const building = buildings.find((item) => item.position === position);

                return (
                    <MobileBuildingItem
                        key={position}
                        category={building?.category}
                        level={building?.level}
                        buildingUrl={building?.buildingUrl}
                        position={position}
                    />
                );
            })}
        </div>
    );
}

async function MobileGrassButtonSection() {
    const monthlyStreak = await getMyStreak();
    const levelByDate = buildActivityGrassMap(monthlyStreak.streaks);

    return (
        <FloatingGrassButton
            title="이번 달 내 잔디"
            levelByDate={levelByDate}
            colorScale={MOBILE_GRASS_COLOR_SCALE}
            tooltipLabel="활동 레벨"
        />
    );
}
