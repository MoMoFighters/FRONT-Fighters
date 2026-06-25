import { getMyInfo } from "@/features/user/action";
import NicknameInputModal from "@/features/auth/components/NicknameInputModal";
import Phone from "@/components/city/Phone";
import MonthlyStreakGarden from "@/components/city/MonthlyStreakGarden";
import BusStation from "@/components/city/BusStation";
import PostBoard from "@/components/city/PostBoard";
import CityCanvas from "@/components/city/CityCanvas";
import { Building } from "@/features/city/type";
import BuildingItem from "@/components/city/BuildingItem";
// import { getMyBuildings } from "../services/city/service";

export default async function StudentMainPage() {

    const myInfo = await getMyInfo();

    // 추후 api 연동
    // const buildings = await getMyBuildings();

    const buildings: Building[] = [
        {
            position: 1,
            category: "STUDY",
            level: 1
        },
        {
            position: 2,
            category: "ART",
            level: 2
        },
        {
            position: 3,
            category: "FITNESS",
            level: 1
        },
        {
            position: 4,
            category: "COOK",
            level: 3
        },
        {
            position: 5,
            category: "BEAUTY",
            level: 3
        },
    ]

    const firstBuilding = buildings.find((building) => building.position === 1);
    const secondBuilding = buildings.find((building) => building.position === 2);
    const thirdBuilding = buildings.find((building) => building.position === 3);
    const forthBuilding = buildings.find((building) => building.position === 4);
    const fifthBuilding = buildings.find((building) => building.position === 5);

    return (
        <CityCanvas>
            <NicknameInputModal nickIsNull={myInfo.data?.nickname === null ? true : false} />
            <BusStation mode='MY' />
            <PostBoard mode="MY" />
            <Phone />
            <MonthlyStreakGarden />

            {/* 1번 자리 */}
            <div className={`${firstBuilding ? "w-40 h-40" : "w-20 h-20"} absolute ${firstBuilding ? "top-18 left-171" : "top-35 left-181"} cursor-pointer ${firstBuilding ? "hover:scale-105" : "hover:scale-110"} transition-all`}>                {firstBuilding
                ? <BuildingItem category={firstBuilding.category} level={firstBuilding.level}></BuildingItem>
                : <BuildingItem></BuildingItem>}
            </div>

            {/* 2번 자리 */}
            <div className={`${secondBuilding ? "w-45 h-40" : "w-20 h-20"} absolute  ${secondBuilding ? "top-48 left-113" : "top-66 left-126"} cursor-pointer ${secondBuilding ? "hover:scale-105" : "hover:scale-110"} transition-all`}>
                {secondBuilding
                    ? <BuildingItem category={secondBuilding.category} level={secondBuilding.level}></BuildingItem>
                    : <BuildingItem></BuildingItem>}
            </div>

            {/* 3번 자리 */}
            <div className={`${thirdBuilding ? "w-45 h-40" : "w-20 h-20"} absolute ${thirdBuilding ? "top-48 left-228" : "top-66 left-238"} cursor-pointer ${thirdBuilding ? "hover:scale-105" : "hover:scale-110"} transition-all`}>
                {thirdBuilding
                    ? <BuildingItem category={thirdBuilding.category} level={thirdBuilding.level}></BuildingItem>
                    : <BuildingItem></BuildingItem>}
            </div>

            {/* 4번 자리 */}
            <div className={`${forthBuilding ? "w-45 h-40" : "w-20 h-20"} absolute ${forthBuilding ? "top-82 left-171" : "top-98 left-181"} cursor-pointer ${forthBuilding ? "hover:scale-105" : "hover:scale-110"} transition-all`}>
                {forthBuilding
                    ? <BuildingItem category={forthBuilding.category} level={forthBuilding.level}></BuildingItem>
                    : <BuildingItem></BuildingItem>}
            </div>

            {/* 5번 자리 */}
            <div className={`${fifthBuilding ? "w-45 h-40" : "w-20 h-20"} absolute ${fifthBuilding ? "top-120 left-108" : "top-134 left-121"} cursor-pointer ${fifthBuilding ? "hover:scale-105" : "hover:scale-110"} transition-all`}>
                {fifthBuilding
                    ? <BuildingItem category={fifthBuilding.category} level={fifthBuilding.level}></BuildingItem>
                    : <BuildingItem></BuildingItem>}
            </div>

            {/* 포인트 상점 고정 자리 */}
            <div className="w-45 h-40 absolute top-84 left-54 cursor-pointer hover:scale-105 transition-all">
                <BuildingItem common="point" />
            </div>
            {/* 집 고정 자리 */}
            <div className="w-50 h-40 absolute top-120 left-224 cursor-pointer hover:scale-105 transition-all">
                <BuildingItem common="mypage" />
            </div>
        </CityCanvas>
    );
}
