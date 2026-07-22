import StudentPageHeader from "@/features/student/components/StudentPageHeader";
import { getMyInfo } from "@/features/user/action";
import {
    getPointStoreItemsAction,
    getProfileOrderListAction,
} from "@/features/point/action";
import { POINT_STORE_PAGE_SIZE, STORE_ITEM_ACCENTS, toPointStoreItem } from "@/features/point/data";
import PointStoreInventorySection from "@/features/point/components/PointStoreInventorySection";
import PointStorePurchaseSection from "@/features/point/components/PointStorePurchaseSection";
import { MyPointItem, ProfileOrderItem } from "@/features/point/type";

const toMyPointItem = (
    item: ProfileOrderItem,
    index: number
): MyPointItem => ({
    id: index + 1,
    itemId: index + 1,
    name: item.itemName,
    category: "PROFILE",
    acquiredAt: "",
    isUsing: false,
    imageUrl: item.imageUrl,
    accentClassName: STORE_ITEM_ACCENTS[index % STORE_ITEM_ACCENTS.length],
});

export default async function PointStorePage() {
    const [myInfo, storeResponse, profileOrderResponse] = await Promise.all([
        getMyInfo(),
        getPointStoreItemsAction({
            page: 1,
            size: POINT_STORE_PAGE_SIZE,
        }),
        getProfileOrderListAction({
            page: 1,
            size: 100,
        }),
    ]);

    const points = myInfo.data?.points ?? 0;
    const storeItems =
        storeResponse.data?.stores.map(toPointStoreItem) ?? [];
    const ownedProfileItems = (profileOrderResponse.data?.items ?? [])
        .filter((item) => item.isOwned)
        .map(toMyPointItem);
    const totalPages = Math.max(storeResponse.data?.totalPages ?? 1, 1);

    return (
        <main className="mx-auto w-full max-w-360 px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
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
                    <PointStorePurchaseSection
                        points={points}
                        initialItems={storeItems}
                        initialTotalPages={totalPages}
                    />
                    <PointStoreInventorySection items={ownedProfileItems} />
                </div>
            </section>
        </main>
    );
}
