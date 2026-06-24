import MomoResidentCard from "@/components/mypage/MomoResidentCard";
import MyBuildingInfo from "@/components/mypage/MyBuildingInfo";
import MyInfoTable from "@/components/mypage/MyInfoTable";
import MyPageNav from "@/components/mypage/MyPageNav";
import StudentPageHeader from "@/features/student/components/StudentPageHeader";
import { getMyInfo } from "@/features/user/action";
import Link from "next/link";

export default async function MyPage() {
    const DATA = await getMyInfo();

    const USER_DATA = {
        name: DATA.data?.name || "이름 없음",
        nickname: DATA.data?.nickname || "닉네임 없음",
        email: DATA.data?.email || "카카오 로그인 계정",
        profileImageUrl: DATA.data?.profileImageUrl || "",
        isTempPwd: DATA.data?.isTempPwd || false,
        createdAt: "260529",
        issueDate: "2026. 05. 29",
        points: 3200,
        buildings: 5,
        isPaid: DATA.data?.isPaid
    };

    return (
        <>
            <div className="p-12">
                <StudentPageHeader
                    backHref="/student"
                    breadcrumbs={[
                        {
                            label: "홈",
                            href: "/student",
                        },
                        {
                            label: "마이페이지",
                        },
                    ]}
                    title="마이페이지"
                />

                <MyPageNav isPaid={USER_DATA.isPaid} />
                <div className="mt-20 flex-1 h-full flex flex-row gap-10">
                    <div>
                        <MomoResidentCard data={USER_DATA} />
                        <div className="flex flex-row justify-end">
                            <Link href='/student/mypage/edit' className="mr-5 mb-2 text-slate-400 font-bold text-sm hover:text-slate-700 transition-colors">
                                내 정보 수정
                            </Link>
                        </div>
                    </div>
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
