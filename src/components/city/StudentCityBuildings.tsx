"use client";

import BuildingItem from "@/components/city/BuildingItem";
import { Building } from "@/features/city/type";

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

interface StudentCityBuildingsProps {
    initialBuildings: Building[];
}

export default function StudentCityBuildings({
    initialBuildings,
}: StudentCityBuildingsProps) {
    return (
        <>
            {buildingSlots.map((slot) => {
                const building = initialBuildings.find(
                    (buildingItem) => buildingItem.position === slot.position
                );

                return (
                    <div
                        key={slot.position}
                        className="absolute"
                        style={building ? slot.filledStyle : slot.emptyStyle}
                    >
                        {building ? (
                            <BuildingItem
                                category={building.category}
                                level={building.level}
                                buildingUrl={building.buildingUrl}
                                priority={slot.position <= 3}
                                imageSizes="(max-width: 768px) 16vw, 13vw"
                            />
                        ) : (
                            <BuildingItem position={slot.position} imageSizes="6vw" />
                        )}
                    </div>
                );
            })}

            <div className="absolute" style={commonBuildingSlots.point}>
                <BuildingItem common="point" imageSizes="13vw" />
            </div>

            <div className="absolute" style={commonBuildingSlots.mypage}>
                <BuildingItem common="mypage" imageSizes="14vw" />
            </div>
        </>
    );
}
