import { Suspense } from "react";
import Phone from "@/components/city/Phone";
import MonthlyStreakGarden from "@/components/city/MonthlyStreakGarden";
import BusStation from "@/components/city/BusStation";
import PostBoard from "@/components/city/PostBoard";
import CityCanvas from "@/components/city/CityCanvas";
import BuildingItem from "@/components/city/BuildingItem";
import MobileBuildingItem from "@/components/city/MobileBuildingItem";
import FloatingGrassButton from "@/components/city/FloatingGrassButton";
import { cookies } from "next/headers";
import { getFriendBuildings, getFriendStreak } from "@/app/services/city/service";
import { getGuestbooksAction } from "@/features/guestbook/action";
import { buildActivityGrassMap } from "@/features/city/utils";
import type { Building } from "@/features/city/type";
import type { GrassLevel } from "@/components/mypage/GrassHeatmap";
import { getMyInfo } from "@/features/user/action";

const MOBILE_GRASS_COLOR_SCALE: Record<GrassLevel, string> = {
    0: "bg-slate-100",
    1: "bg-indigo-200",
    2: "bg-indigo-400",
    3: "bg-indigo-600",
    4: "bg-indigo-800",
};

const BUILDING_POSITIONS = [1, 2, 3, 4, 5] as const;

const buildingSlots = [
    {
        position: 1,
        filledStyle: { top: "9.54%", left: "47.5%", width: "11.11%", aspectRatio: "1 / 1" },
        emptyStyle: { top: "17.65%", left: "50.28%", width: "5.56%", aspectRatio: "1 / 1" },
    },
    {
        position: 2,
        filledStyle: { top: "25%", left: "31.8%", width: "12.5%", aspectRatio: "9 / 8" },
        emptyStyle: { top: "32.5%", left: "35%", width: "5.56%", aspectRatio: "1 / 1" },
    },
    {
        position: 3,
        filledStyle: { top: "25%", left: "63%", width: "12.5%", aspectRatio: "9 / 8" },
        emptyStyle: { top: "32.5%", left: "66.11%", width: "5.56%", aspectRatio: "1 / 1" },
    },
    {
        position: 4,
        filledStyle: { top: "40%", left: "47.5%", width: "12.5%", aspectRatio: "9 / 8" },
        emptyStyle: { top: "48.5%", left: "50.5%", width: "5.56%", aspectRatio: "1 / 1" },
    },
    {
        position: 5,
        filledStyle: { top: "58%", left: "30.5%", width: "12.5%", aspectRatio: "9 / 8" },
        emptyStyle: { top: "66%", left: "33.75%", width: "5.56%", aspectRatio: "1 / 1" },
    },
] as const;

const commonBuildingSlots = {
    point: { top: "41.5%", left: "15%", width: "12.5%", aspectRatio: "9 / 8" },
    mypage: { top: "60%", left: "62.22%", width: "13.89%", aspectRatio: "5 / 4" },
} as const;

export default async function FriendCityPage({ params }: {
    params: Promise<{
        userId: string;
    }>
}) {
    const { userId } = await params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const [guestbookResponse, myInfo] = await Promise.all([
        getGuestbooksAction(Number(userId)),
        getMyInfo()
    ])
    const initialDnd = myInfo.data?.doNotDisturb
    const guestbooks = guestbookResponse.data ?? [];

    return (
        <>
            {/* 태블릿+데스크탑(md 이상): 기존 도시 배경 그대로 */}
            <div className="hidden h-full md:block">
                <CityCanvas>
                    <BusStation mode='FRIEND' currentOwnerId={Number(userId)} />
                    <PostBoard
                        mode="FRIEND"
                        ownerId={Number(userId)}
                        initialGuestbooks={guestbooks}
                    />
                    <Phone accessToken={accessToken} initialNotification={initialDnd} />

                    <Suspense fallback={null}>
                        <StreakSection userId={userId} />
                    </Suspense>

                    {/* 포인트 상점은 fetch와 무관해서 즉시 렌더링 */}
                    <div
                        className="absolute"
                        style={commonBuildingSlots.point}
                    >
                        <BuildingItem common="point" imageSizes="13vw" interactive={false} />
                    </div>

                    <Suspense fallback={null}>
                        <BuildingsSection userId={userId} />
                    </Suspense>
                </CityCanvas>
            </div>

            {/* 모바일(md 미만): 도시 배경 대신 리스트형 레이아웃 */}
            <div className="block md:hidden">
                <div className="min-h-screen bg-white px-4 py-6 pb-24">
                    <Suspense fallback={null}>
                        <MobileFriendTitleSection userId={userId} />
                    </Suspense>

                    <Suspense fallback={null}>
                        <MobileBuildingsSection userId={userId} />
                    </Suspense>

                    <div className="mt-4 space-y-3">
                        <BusStation mode="FRIEND" currentOwnerId={Number(userId)} variant="mobile" />
                        <PostBoard
                            mode="FRIEND"
                            ownerId={Number(userId)}
                            initialGuestbooks={guestbooks}
                            variant="mobile"
                        />
                    </div>
                </div>

                <Suspense fallback={null}>
                    <MobileGrassButtonSection userId={userId} />
                </Suspense>
            </div>
        </>
    );
}

async function StreakSection({ userId }: { userId: string }) {
    const monthlyStreak = await getFriendStreak(userId);

    return (
        <MonthlyStreakGarden
            initialStreak={monthlyStreak}
            userId={userId}
        />
    );
}

async function BuildingsSection({ userId }: { userId: string }) {
    const { nickname, buildings } = await getFriendBuildings(userId);

    return (
        <>
            {/* 친구 도시의 경우 각 아이템들은 그저 볼 수 있는 고정 이미지로 */}
            {buildingSlots.map((slot) => {
                const building = buildings.find((building) => building.position === slot.position);

                return (
                    <div
                        key={slot.position}
                        className="absolute"
                        style={building ? slot.filledStyle : slot.emptyStyle}
                    >
                        {building
                            ? <BuildingItem
                                category={building.category}
                                level={building.level}
                                buildingUrl={building.buildingUrl}
                                priority={slot.position <= 3}
                                imageSizes="(max-width: 768px) 16vw, 13vw"
                                interactive={false}
                            />
                            : ""}
                    </div>
                );
            })}

            {/* 집 고정 자리 (친구 도시에서는 그룹 스터디로만 이동) */}
            <div
                className="absolute"
                style={commonBuildingSlots.mypage}
            >
                <BuildingItem
                    common="mypage"
                    imageSizes="14vw"
                    mode="FRIEND"
                    friendNickname={nickname}
                />
            </div>
        </>
    );
}

async function MobileFriendTitleSection({ userId }: { userId: string }) {
    const { nickname } = await getFriendBuildings(userId);

    return (
        <p className="mb-4 text-sm font-black text-slate-700">
            {nickname}님이 보유한 건물
        </p>
    );
}

async function MobileBuildingsSection({ userId }: { userId: string }) {
    const { buildings } = await getFriendBuildings(userId);

    const ownedBuildings = BUILDING_POSITIONS
        .map((position) => buildings.find((building) => building.position === position))
        .filter((building): building is Building => Boolean(building));

    if (ownedBuildings.length === 0) {
        return (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm font-medium text-slate-400">
                아직 지어진 건물이 없어요.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-3">
            {ownedBuildings.map((building) => (
                <MobileBuildingItem
                    key={building.position}
                    category={building.category}
                    level={building.level}
                    buildingUrl={building.buildingUrl}
                    interactive={false}
                />
            ))}
        </div>
    );
}

async function MobileGrassButtonSection({ userId }: { userId: string }) {
    const monthlyStreak = await getFriendStreak(userId);
    const levelByDate = buildActivityGrassMap(monthlyStreak.streaks);

    return (
        <FloatingGrassButton
            title="이 친구의 이번 달 잔디"
            levelByDate={levelByDate}
            colorScale={MOBILE_GRASS_COLOR_SCALE}
            tooltipLabel="활동 레벨"
        />
    );
}
