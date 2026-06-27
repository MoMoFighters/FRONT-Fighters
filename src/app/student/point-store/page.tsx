import StudentPageHeader from "@/features/student/components/StudentPageHeader";
import { getMyInfo } from "@/features/user/action";
import {
    getPointStoreItemsAction,
    getProfileOrderListAction,
} from "@/features/point/action";
import PointStoreInventorySection from "@/features/point/components/PointStoreInventorySection";
import PointStorePurchaseSection from "@/features/point/components/PointStorePurchaseSection";
import { MyPointItem, PointStoreItem, ProfileOrderItem } from "@/features/point/type";

interface PointStorePageProps {
    searchParams: Promise<{
        page?: string;
    }>;
}

const PAGE_SIZE = 12;

const STORE_ITEM_ACCENTS = [
    "from-rose-100 via-orange-50 to-amber-100 text-rose-500",
    "from-indigo-100 via-slate-50 to-violet-100 text-indigo-500",
    "from-emerald-100 via-teal-50 to-cyan-100 text-emerald-500",
    "from-violet-100 via-purple-50 to-fuchsia-100 text-violet-500",
];

const toPointStoreItem = (
    item: {
        id: number;
        name: string;
        price: number;
        url: string | null;
        type: PointStoreItem["category"];
    },
    index: number
): PointStoreItem => ({
    id: item.id,
    name: item.name,
    category: item.type,
    price: item.price,
    imageUrl: item.url,
    accentClassName: STORE_ITEM_ACCENTS[index % STORE_ITEM_ACCENTS.length],
});

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

export default async function PointStorePage({
    searchParams,
}: PointStorePageProps) {
    const { page } = await searchParams;
    const requestedPage = Math.max(Number(page) || 1, 1);

    const [myInfo, storeResponse, profileOrderResponse] = await Promise.all([
        getMyInfo(),
        getPointStoreItemsAction({
            page: requestedPage,
            size: PAGE_SIZE,
        }),
        getProfileOrderListAction(),
    ]);

    const points = myInfo.data?.points ?? 0;
    const storeItems =
        storeResponse.data?.stores.map(toPointStoreItem) ?? [];
    const ownedProfileItems =
        profileOrderResponse.data?.owned.map(toMyPointItem) ?? [];
    const totalPages = Math.max(storeResponse.data?.totalPages ?? 1, 1);
    const currentPage = Math.min(
        Math.max(storeResponse.data?.page ?? requestedPage, 1),
        totalPages
    );

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
                    <PointStorePurchaseSection
                        points={points}
                        items={storeItems}
                        currentPage={currentPage}
                        totalPages={totalPages}
                    />
                    <PointStoreInventorySection items={ownedProfileItems} />
                </div>
            </section>
        </main>
    );
}
