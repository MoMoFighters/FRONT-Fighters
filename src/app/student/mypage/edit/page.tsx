import { getMyInfo } from "@/features/user/action";
import MyPageEditClient from "@/features/user/MyPageEditClient";

export default async function MyPageEdit() {
    const userInfo = await getMyInfo();

    if (!userInfo.success || !userInfo.data) {
        throw new Error(userInfo.message || "유저 정보 로드 실패");
    }

    const cardData = {
        name: userInfo.data.name,
        nickname: userInfo.data.nickname,
        createdAt: userInfo.data.createdAt,
        profileImageUrl: userInfo.data.profileImageUrl,
    };

    return (
        <MyPageEditClient
            userInfo={userInfo}
            initialCardData={cardData}
        />
    );
}
