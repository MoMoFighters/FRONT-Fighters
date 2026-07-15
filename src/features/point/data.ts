import { PointStoreApiItem, PointStoreCategoryMeta, PointStoreItem } from "./type";

export const POINT_STORE_CATEGORIES: PointStoreCategoryMeta[] = [
    {
        value: "ALL",
        label: "전체",
    },
    {
        value: "PROFILE",
        label: "프로필",
    },
];

export const POINT_STORE_PAGE_SIZE = 12;

export const STORE_ITEM_ACCENTS = [
    "from-rose-100 via-orange-50 to-amber-100 text-rose-500",
    "from-indigo-100 via-slate-50 to-violet-100 text-indigo-500",
    "from-emerald-100 via-teal-50 to-cyan-100 text-emerald-500",
    "from-violet-100 via-purple-50 to-fuchsia-100 text-violet-500",
];

export const toPointStoreItem = (
    item: PointStoreApiItem,
    index: number
): PointStoreItem => ({
    id: item.id,
    name: item.name,
    category: item.type,
    price: item.price,
    imageUrl: item.url,
    isOwned: item.isOwned,
    accentClassName: STORE_ITEM_ACCENTS[index % STORE_ITEM_ACCENTS.length],
});
