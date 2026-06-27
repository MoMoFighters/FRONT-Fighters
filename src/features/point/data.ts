import { MyPointItem, PointStoreCategoryMeta } from "./type";

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

export const MY_POINT_ITEMS: MyPointItem[] = [
    {
        id: 1,
        itemId: 1,
        name: "모모 뱃지",
        category: "PROFILE",
        acquiredAt: "2026.06.20",
        isUsing: true,
        imageUrl: "https://momocity-bucket.s3.ap-northeast-2.amazonaws.com/store/item1.png",
        accentClassName: "from-rose-100 via-orange-50 to-amber-100 text-rose-500",
    },
];
