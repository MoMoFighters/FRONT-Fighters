import MyPageNav from "@/components/mypage/MyPageNav";
import StudentPageHeader from "@/features/student/components/StudentPageHeader";
import { getMyInfo } from "@/features/user/action";
import MyPageEditClient from "@/features/user/components/mypage/MyPageEditClient";

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
        <div className="p-12">
            <StudentPageHeader
                backHref="/student/mypage"
                breadcrumbs={[
                    {
                        label: "홈",
                        href: "/student",
                    },
                    {
                        label: "마이페이지",
                        href: "/student/mypage",
                    },
                    {
                        label: "내 정보 수정",
                    },
                ]}
                title=""
            />
            <MyPageEditClient
                userInfo={userInfo}
                initialCardData={cardData}
            />
        </div>
    );
}
