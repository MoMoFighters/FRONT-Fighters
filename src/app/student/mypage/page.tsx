import MomoResidentCard from "@/components/mypage/MomoResidentCard";
import MyBuildingInfo from "@/components/mypage/MyBuildingInfo";
import MyInfoTable from "@/components/mypage/MyInfoTable";
import MyPageNav from "@/components/mypage/MyPageNav";


export default function MyPage() {

    //내 정보 패칭 받기
    const USER_DATA = {
        name: '홍길동',
        nickname: '모모시민',
        // date값 받아와서 yymmdd로
        createdAt: 111111,
        issueDate: '2025. 11. 28',
        email: 'momocity@momo.kr',
        points: 3200,
        buildings: 5,
    };

    return (
        <div className="flex flex-col">
            <MyPageNav />
            <div className="flex flex-row gap-10 p-12">
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
    );
}