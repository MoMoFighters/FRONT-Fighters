import { Suspense } from "react";
import Phone from "@/components/city/Phone";
import MonthlyStreakGarden from "@/components/city/MonthlyStreakGarden";
import BusStation from "@/components/city/BusStation";
import PostBoard from "@/components/city/PostBoard";
import CityCanvas from "@/components/city/CityCanvas";
import BuildingItem from "@/components/city/BuildingItem";
import { cookies } from "next/headers";
import { getFriendBuildings, getFriendStreak } from "@/app/services/city/service";
import { getGuestbooksAction } from "@/features/guestbook/action";

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

export default async function StudentMainPage({ params }: {
    params: Promise<{
        userId: string;
    }>
}) {
    const { userId } = await params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    // PostBoard가 FRIEND 모드에서는 모달 오픈 시 자체 재조회를 하지 않으므로 그대로 blocking 유지
    const guestbookResponse = await getGuestbooksAction(Number(userId));
    const guestbooks = guestbookResponse.data ?? [];

    return (
        <CityCanvas>
            <BusStation mode='FRIEND' currentOwnerId={Number(userId)} />
            <PostBoard
                mode="FRIEND"
                ownerId={Number(userId)}
                initialGuestbooks={guestbooks}
            />
            <Phone accessToken={accessToken} />

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
