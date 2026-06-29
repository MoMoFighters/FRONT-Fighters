import MomoResidentCard from "@/components/mypage/MomoResidentCard";
import MyBuildingInfo from "@/components/mypage/MyBuildingInfo";
import MyInfoTable from "@/components/mypage/MyInfoTable";
import MyPageNav from "@/components/mypage/MyPageNav";
import DeleteAccountBtn from "@/features/auth/components/DeleteAccountBtn";
import StudentPageHeader from "@/features/student/components/StudentPageHeader";
import { getMyInfo } from "@/features/user/action";
import { PencilLine, UserRound } from "lucide-react";
import Link from "next/link";

export default async function MyPage() {
    const DATA = await getMyInfo();
    console.log(DATA);

    const USER_DATA = {
        name: DATA.data?.name || "이름 없음",
        nickname: DATA.data?.nickname || "닉네임 없음",
        email: DATA.data?.email || "소셜 로그인 계정",
        profileImageUrl: DATA.data?.profileImageUrl || "",
        isTempPwd: DATA.data?.isTempPwd || false,
        createdAt: DATA.data?.createdAt || new Date().toISOString(),
        points: DATA.data?.points ?? 0,
        buildings: DATA.data?.buildingInfos.length ?? 0,
    };

    return (
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

            <MyPageNav
                nickname={USER_DATA.nickname}
                buildingCount={USER_DATA.buildings}
            />

            <section className="mt-12 rounded-[2rem] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex size-13 items-center justify-center rounded-2xl bg-white text-indigo-500 shadow-sm ring-1 ring-indigo-100">
                            <UserRound className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-indigo-500">
                                MOMO RESIDENT
                            </p>
                            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                                {USER_DATA.nickname}님의 도시 프로필
                            </h2>
                        </div>
                    </div>

                    <Link
                        href="/student/mypage/edit"
                        className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-black text-white transition hover:bg-indigo-500"
                    >
                        <PencilLine className="h-4 w-4" />
                        정보 수정
                    </Link>
                </div>

                <div className="grid grid-cols-[580px_minmax(0,1fr)] gap-8">
                    <div className="space-y-4">
                        <div className="h-full flex justify-center flex-col p-2">
                            <div className="h-full" />
                            <MomoResidentCard data={USER_DATA} />
                            <div className="h-full flex justify-start items-end">
                                <DeleteAccountBtn userName={USER_DATA.nickname} />
                            </div>
                        </div>
                    </div>

                    <div className="flex min-w-0 flex-col gap-5">
                        <MyInfoTable data={USER_DATA} />
                        <MyBuildingInfo data={USER_DATA} />
                    </div>
                </div>
            </section>
        </div>
    );
}
