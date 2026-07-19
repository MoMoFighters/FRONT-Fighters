import Phone from "@/components/city/Phone";
import MonthlyStreakGarden from "@/components/city/MonthlyStreakGarden";
import BusStation from "@/components/city/BusStation";
import PostBoard from "@/components/city/PostBoard";
import CityCanvas from "@/components/city/CityCanvas";
import StudentCityBuildings from "@/components/city/StudentCityBuildings";
import FortuneSpot from "@/features/city/components/FortuneSpot";
import { cookies } from "next/headers";
import { getMyBuildings, getMyStreak } from "../services/city/service";
import { getMyInfo } from "@/features/user/action";
import { getGuestbooksAction } from "@/features/guestbook/action";
import NicknameInputModal from "@/features/auth/components/NicknameInputModal";

export default async function StudentMainPage() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const [buildings, myInfo, monthlyStreak, guestbookResponse] = await Promise.all([
        getMyBuildings(),
        getMyInfo(),
        getMyStreak(),
        getGuestbooksAction(),
    ]);
    console.log(myInfo)
    const dnd = myInfo.data?.doNotDisturb;
    const guestbooks = guestbookResponse.data ?? [];

    return (
        <CityCanvas>
            {!myInfo.data?.nickname &&
                <NicknameInputModal />
            }
            <BusStation mode="MY" />
            <PostBoard mode="MY" initialGuestbooks={guestbooks} />
            <Phone accessToken={accessToken} initialNotification={dnd} />
            <MonthlyStreakGarden initialStreak={monthlyStreak} />
            <StudentCityBuildings initialBuildings={buildings} />
            <FortuneSpot />
        </CityCanvas>
    );
}
