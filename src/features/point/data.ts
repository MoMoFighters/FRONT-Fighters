import { MyPointItem, PointStoreCategoryMeta, PointStoreItem } from "./type";

export const POINT_STORE_CATEGORIES: PointStoreCategoryMeta[] = [
    {
        value: "ALL",
        label: "전체",
    },
    {
        value: "PROFILE_IMAGE",
        label: "프로필사진",
    },
];

export const POINT_STORE_ITEMS: PointStoreItem[] = [
    {
        id: 1,
        name: "복숭아 햇살 프로필",
        category: "PROFILE_IMAGE",
        price: 1200,
        description: "따뜻한 복숭아빛 기본 프로필 이미지",
        badge: "NEW",
        accentClassName: "from-rose-100 via-orange-50 to-amber-100 text-rose-500",
    },
    {
        id: 2,
        name: "인디고 밤하늘 프로필",
        category: "PROFILE_IMAGE",
        price: 1600,
        description: "차분한 인디고 톤 프로필 이미지",
        badge: "HOT",
        accentClassName: "from-indigo-100 via-slate-50 to-violet-100 text-indigo-500",
    },
    {
        id: 3,
        name: "민트 리프 프로필",
        category: "PROFILE_IMAGE",
        price: 900,
        description: "가벼운 민트 포인트 프로필 이미지",
        accentClassName: "from-emerald-100 via-teal-50 to-cyan-100 text-emerald-500",
    },
    {
        id: 4,
        name: "라벤더 무드 프로필",
        category: "PROFILE_IMAGE",
        price: 1400,
        description: "부드러운 라벤더 톤 프로필 이미지",
        accentClassName: "from-violet-100 via-purple-50 to-fuchsia-100 text-violet-500",
    },
];

export const MY_POINT_ITEMS: MyPointItem[] = [
    {
        id: 1,
        itemId: 1,
        name: "복숭아 햇살 프로필",
        category: "PROFILE_IMAGE",
        acquiredAt: "2026.06.20",
        isUsing: true,
        accentClassName: "from-rose-100 via-orange-50 to-amber-100 text-rose-500",
    },
    {
        id: 2,
        itemId: 3,
        name: "민트 리프 프로필",
        category: "PROFILE_IMAGE",
        acquiredAt: "2026.06.22",
        isUsing: false,
        accentClassName: "from-emerald-100 via-teal-50 to-cyan-100 text-emerald-500",
    },
];
