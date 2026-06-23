import { getMyInfo } from "@/features/user/action";
import NicknameInputModal from "@/features/auth/components/NicknameInputModal";
import Phone from "@/components/city/Phone";
import MonthlyStreakGarden from "@/components/city/MonthlyStreakGarden";
import BusStation from "@/components/city/BusStation";
import PostBoard from "@/components/city/PostBoard";
import CityCanvas from "@/components/city/CityCanvas";

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
        <CityCanvas>
            <NicknameInputModal nickIsNull={myInfo.data?.nickname === null ? true : false} />
            <BusStation mode='MY' />
            <PostBoard mode="MY" />
            <Phone />
            <MonthlyStreakGarden />
        </CityCanvas>
    );
}
