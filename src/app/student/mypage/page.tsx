import MomoResidentCard from "@/components/mypage/MomoResidentCard";
import MyBuildingInfo from "@/components/mypage/MyBuildingInfo";
import MyInfoTable from "@/components/mypage/MyInfoTable";
import MyPageNav from "@/components/mypage/MyPageNav";
import { getMyInfo } from "@/features/user/action";

export default async function MyPage() {
    const DATA = await getMyInfo();

    // 💡 백엔드 알맹이 데이터에 존재하지 않는 임시 프론트엔드용 기본값 결합
    const USER_DATA = {
        name: DATA.data?.name || "시민",
        nickname: DATA.data?.nickname || "모모시민",
        email: DATA.data?.email || "example@example.com",
        profileImageUrl: DATA.data?.profileImageUrl || null,
        isTempPwd: DATA.data?.isTempPwd || false,
        // 아래는 컴포넌트 요구사항 충족을 위한 임시/확장 데이터
        createdAt: "260529",
        issueDate: "2026. 05. 29",
        points: 3200,
        buildings: 5,
    };

    return (
        <>
            <div className="p-12">
                <MyPageNav />
                <div className="mt-20 flex-1 h-full flex flex-row gap-10">
                    {/* 💡 각 컴포넌트의 가독성과 유지보수를 위해 똑같이 data={USER_DATA} 형식으로 통일합니다. */}
                    <MomoResidentCard data={USER_DATA} />
                    <div className="grid grid-rows-2 flex-1 h-full">
                        <div className="flex flex-col py-2">
                            <p className="text-lg font-bold">계정 정보</p>
                            <MyInfoTable data={USER_DATA} />
                        </div>
                        <div className="flex flex-col py-2">
                            <p className="text-lg font-bold">보유 건물 현황</p>
                            <MyBuildingInfo data={USER_DATA} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}