import StudentPageHeader from "@/features/student/components/StudentPageHeader";
import MembershipPlans from "@/features/membership/components/MembershipPlans";
import { getMyInfo } from "@/features/user/action";

export default async function Membership() {
    const myInfoResponse = await getMyInfo();
    const currentTier = myInfoResponse.data?.membership ?? "BASIC";

    return (
        <main className="mx-auto w-full max-w-360 px-12 py-12">
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

            <section className="mt-8">
                <MembershipPlans
                    currentTier={currentTier}
                    membershipUntil={myInfoResponse.data?.membershipUntil}
                />
            </section>
        </main>
    );
}