import MembershipPlans from "@/features/membership/components/MembershipPlans";

export default function GuestMembership() {
    return (
        <>
            <section className="border-b border-slate-200 bg-white py-12 sm:py-14">
                <div className="px-5 text-center sm:px-8 lg:px-16">
                    <p className="text-[11px] font-semibold text-indigo-500">
                        MEMBERSHIP
                    </p>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                        나에게 맞는 플랜으로{" "}
                        <span className="text-indigo-500">모모시티</span>를 시작해보세요
                    </h1>

                    <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600">
                        커뮤니티 이용부터 강의 수강, 챗봇 무제한 이용까지
                        <br />
                        원하는 만큼만 딱 맞게 이용할 수 있어요.
                    </p>
                </div>
            </section>

            <section className="px-5 py-12 sm:px-8 lg:px-16">
                <div className="mx-auto max-w-5xl">
                    <MembershipPlans mode="guest" />
                </div>
            </section>
        </>
    );
}
