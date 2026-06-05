import Image from "next/image";
import city from '@/app/assets/img/cityImg.png'
import logo from '@/app/assets/img/logo.png'
import logo2 from '@/app/assets/img/logo2.png'
import CreateBuildingBtn from "@/components/city/CreateBuildingBtn";
import BuildingItem from "@/components/city/BuildingItem";
import { getMyInfo } from "@/features/user/action";
import NicknameInputModal from "@/features/auth/components/NicknameInputModal";
import OnSidebarBtn from '@/features/city/components/buttons/OnSidebarBtn'
import arthall from '@/app/assets/img/arthall.png'

interface Building {
    position: string;
    category: string;
    level: number;
}

const POSITION_STYLE = {
    first: "top-[18%] left-[6%]",
    second: "top-[18%] left-[23%]",
    third: "top-[18%] left-[39%]",
    fourth: "top-[66%] left-[16%]",
    fifth: "top-[66%] left-[36%]",
};

const POSITIONS = [
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
] as const;

export default async function StudentMainPage() {

    const myInfo = await getMyInfo();

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
            category: "fitness",
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
        <div className="relative w-full h-full overflow-hidden">
            <NicknameInputModal nickIsNull={myInfo.data?.nickname === null ? true : false} />
            <Image
                src={city}
                alt="도시배경"
                fill
                quality={80}
                priority
            />
            <OnSidebarBtn />
            <div className="absolute top-15 left-70">
                <Image
                    src={arthall}
                    alt="예술 건물"
                    width={350}
                />
            </div>
            {/* {POSITIONS.map((position) => {

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
            })} */}
            {/* <div className="absolute top-[10%] right-[12%]">
                <BuildingItem category="community" />
            </div>
            <div className="absolute top-[35%] right-[12%]">
                <BuildingItem category="mypage" />
            </div>
            <div className="absolute top-[60%] right-[12%]">
                <BuildingItem category="payments" />
            </div> */}
        </div>
    );
}