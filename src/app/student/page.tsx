import Phone from "@/components/city/Phone";
import MonthlyStreakGarden from "@/components/city/MonthlyStreakGarden";
import BusStation from "@/components/city/BusStation";
import PostBoard from "@/components/city/PostBoard";
import CityCanvas from "@/components/city/CityCanvas";
import BuildingItem from "@/components/city/BuildingItem";
import { cookies } from "next/headers";
import { getMyBuildings, getMyStreak } from "../services/city/service";

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

export default async function StudentMainPage() {

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    // 추후 api 연동
    const buildings = await getMyBuildings();
    const today = new Date();
    const monthlyStreak = await getMyStreak({
        year: today.getFullYear(),
        month: today.getMonth() + 1,
    });

    return (
        <CityCanvas>
            <BusStation mode='MY' />
            <PostBoard mode="MY" />
            <Phone accessToken={accessToken} />
            <MonthlyStreakGarden initialStreak={monthlyStreak} />

            {buildingSlots.map((slot) => {
                const building = buildings.find((building) => building.position === slot.position);

                return (
                    <div
                        key={slot.position}
                        className={`absolute cursor-pointer transition-all ${building ? "hover:scale-105" : "hover:scale-110"}`}
                        style={building ? slot.filledStyle : slot.emptyStyle}
                    >
                        {building
                            ? <BuildingItem category={building.category} level={building.level} buildingUrl={building.buildingUrl} />
                            : <BuildingItem position={slot.position} />}
                    </div>
                );
            })}

            {/* 포인트 상점 고정 자리 */}
            <div
                className="absolute cursor-pointer transition-all hover:scale-105"
                style={commonBuildingSlots.point}
            >
                <BuildingItem common="point" />
            </div>
            {/* 집 고정 자리 */}
            <div
                className="absolute cursor-pointer transition-all hover:scale-105"
                style={commonBuildingSlots.mypage}
            >
                <BuildingItem common="mypage" />
            </div>
        </CityCanvas>
    );
}
