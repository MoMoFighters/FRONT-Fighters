import Phone from "@/components/city/Phone";
import MonthlyStreakGarden from "@/components/city/MonthlyStreakGarden";
import BusStation from "@/components/city/BusStation";
import PostBoard from "@/components/city/PostBoard";
import CityCanvas from "@/components/city/CityCanvas";
import StudentCityBuildings from "@/components/city/StudentCityBuildings";
import { cookies } from "next/headers";
import { getMyBuildings, getMyStreak } from "../services/city/service";
import { getMyInfo } from "@/features/user/action";

export default async function StudentMainPage() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const buildings = await getMyBuildings();
    const myInfo = await getMyInfo();
    const dnd = myInfo.data?.doNotDisturb;
    const today = new Date();
    const monthlyStreak = await getMyStreak({
        year: today.getFullYear(),
        month: today.getMonth() + 1,
    });

    return (
        <CityCanvas>
            <BusStation mode="MY" />
            <PostBoard mode="MY" />
            <Phone accessToken={accessToken} initialNotification={dnd} />
            <MonthlyStreakGarden initialStreak={monthlyStreak} />
            <StudentCityBuildings initialBuildings={buildings} />
        </CityCanvas>
    );
}
