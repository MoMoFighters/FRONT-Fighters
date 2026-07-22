import Link from "next/link";
import { Receipt } from "lucide-react";

import StudentPageHeader from "@/features/student/components/StudentPageHeader";
import MembershipPlans from "@/features/membership/components/MembershipPlans";
import { getMyInfo } from "@/features/user/action";

export default async function Membership() {
    const myInfoResponse = await getMyInfo();
    const currentTier = myInfoResponse.data?.membership ?? "BASIC";

    return (
        <main className="mx-auto w-full max-w-360 px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
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
                        label: "멤버십",
                    },
                ]}
                title="멤버십"
            />

            <div className="mt-4 flex justify-end">
                <Link
                    href="/student/mypage/payment"
                    className="flex items-center gap-1.5 text-sm font-bold text-indigo-500 transition-colors hover:text-indigo-600"
                >
                    <Receipt className="h-4 w-4" />
                    결제 내역 보기
                </Link>
            </div>

            <section className="mt-4">
                <MembershipPlans
                    currentTier={currentTier}
                    membershipUntil={myInfoResponse.data?.membershipUntil}
                    membershipStart={myInfoResponse.data?.membershipStart}
                />
            </section>
        </main>
    );
}