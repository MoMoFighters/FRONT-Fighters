import Phone from "@/components/city/Phone";
import MonthlyStreakGarden from "@/components/city/MonthlyStreakGarden";
import BusStation from "@/components/city/BusStation";
import PostBoard from "@/components/city/PostBoard";
import CityCanvas from "@/components/city/CityCanvas";
import { Building } from "@/features/city/type";
import BuildingItem from "@/components/city/BuildingItem";
import Image from "next/image";

// 임의로 로컬에 이미지 저장해놓고 사용, 실제로는 api 응답값에 있는 이미지 사용
import study from "@/app/assets/img/study.png"
import fitness from "@/app/assets/img/fitness.png"
import art from "@/app/assets/img/art.png"
import beauty from "@/app/assets/img/beauty.png"
import cook from "@/app/assets/img/cook.png"
import mypage from "@/app/assets/img/mypage.png";
import point from "@/app/assets/img/point.png";
import { cookies } from "next/headers";

// 추후 api 연동 시 임포트 구문
// import { getMyBuildings } from "../services/city/service";

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

    // 추후 api 연동 - 친구 껄로
    // const buildings = await getFriendBuildings(userId);

    const buildings: Building[] = [
        {
            position: 1,
            category: "STUDY",
            level: 1,
            buildingUrl: study
        },
        {
            position: 2,
            category: "ART",
            level: 2,
            buildingUrl: art
        },
        {
            position: 3,
            category: "FITNESS",
            level: 1,
            buildingUrl: fitness
        },
        {
            position: 4,
            category: "COOK",
            level: 3,
            buildingUrl: cook
        },
        {
            position: 5,
            category: "BEAUTY",
            level: 3,
            buildingUrl: beauty
        },
    ]

    return (
        <CityCanvas>
            <BusStation mode='FRIEND' />
            <PostBoard mode="FRIEND" />
            <Phone accessToken={accessToken} />
            <MonthlyStreakGarden />

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
                            ? <Image
                                src={building.buildingUrl}
                                alt={building.category}
                                fill
                                className="object-contain"
                            />
                            : ""}
                    </div>
                );
            })}

            {/* 포인트 상점 고정 자리 */}
            <div
                className="absolute"
                style={commonBuildingSlots.point}
            >
                <Image
                    src={point}
                    alt="포인트 상점"
                    fill
                    className="object-contain"
                />
            </div>
            {/* 집 고정 자리 */}
            <div
                className="absolute"
                style={commonBuildingSlots.mypage}
            >
                <Image
                    src={mypage}
                    alt="집"
                    fill
                    className="object-contain"
                />
            </div>
        </CityCanvas>
    );
}
