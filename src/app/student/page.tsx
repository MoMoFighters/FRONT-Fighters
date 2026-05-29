import Image from "next/image";
import city from '@/app/assets/img/momocity.png'
import CreateBuildingBtn from "@/components/city/CreateBuildingBtn";
import BuildingItem from "@/components/city/BuildingItem";

interface Building {
    position: string;
    category: string;
    level: number;
}

const POSITION_STYLE = {
    first: "top-[19%] left-[5%]",
    second: "top-[19%] left-[22%]",
    third: "top-[19%] left-[38%]",
    fourth: "top-[68%] left-[15%]",
    fifth: "top-[68%] left-[35%]",
};

const POSITIONS = [
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
] as const;

export default function StudentMainPage() {

    // 테스트용 데이터, 백엔드 팀원과 소통 필요 null 인지 아예 없는 옵셔널인지..
    const buildings: Building[] = [
        {
            position: "first",
            category: "study",
            level: 1
        },
        {
            position: "second",
            category: "art",
            level: 2
        },
        {
            position: "third",
            category: "health",
            level: 1
        },
        {
            position: "fourth",
            category: "cook",
            level: 3
        },
        {
            position: "fifth",
            category: "beauty",
            level: 3
        },
    ]

    return (
        <div className="relative w-full h-full scrollbar-hidden">
            <Image
                src={city}
                alt="도시배경"
                className="w-full h-auto"
                priority
            />
            {POSITIONS.map((position) => {

                const building = buildings.find(
                    (building) => building.position === position
                );

                return (
                    <div
                        key={position}
                        className={`
                            absolute
                            ${POSITION_STYLE[position]}
                        `}
                    >
                        {building?.position ? (

                            <BuildingItem
                                category={building.category}
                                level={building.level}
                            />
                        ) : (
                            <CreateBuildingBtn />
                        )}
                    </div>
                );
            })}
            {/* 도서관 위치 고정 */}
            <div className="absolute top-[10%] right-[12%]">
                <BuildingItem category="community" />
            </div>
            {/* 집 위치 고정 */}
            <div className="absolute top-[35%] right-[12%]">
                <BuildingItem category="mypage" />
            </div>
            {/* 포인트 상점 위치 고정 */}
            <div className="absolute top-[60%] right-[12%]">
                <BuildingItem category="market" />
            </div>
        </div>
    );
}