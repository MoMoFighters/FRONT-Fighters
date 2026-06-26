import StudentPageHeader from "@/features/student/components/StudentPageHeader";
import { getMyInfo } from "@/features/user/action";
import PointStoreInventorySection from "@/features/point/components/PointStoreInventorySection";
import PointStorePurchaseSection from "@/features/point/components/PointStorePurchaseSection";

export default async function PointStorePage() {
    const myInfo = await getMyInfo();
    const points = myInfo.data?.points ?? 0;

    return (
        <main className="mx-auto w-full max-w-360 px-12 py-12">
            <StudentPageHeader
                backHref="/student"
                breadcrumbs={[
                    {
                        label: "홈",
                        href: "/student",
                    },
                    {
                        label: "포인트 상점",
                    },
                ]}
                title="포인트 상점"
            />

            <section className="rounded-[2rem] border border-indigo-100 bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 p-4 shadow-sm">
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_28rem]">
                    <PointStorePurchaseSection points={points} />
                    <PointStoreInventorySection />
                </div>
            </section>
        </main>
    );
}
