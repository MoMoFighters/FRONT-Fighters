export type PointItemCategory = "PROFILE_IMAGE";
export type PointStoreTab = "ALL" | PointItemCategory;

export interface PointStoreCategoryMeta {
    value: PointStoreTab;
    label: string;
}

export interface PointStoreItem {
    id: number;
    name: string;
    category: PointItemCategory;
    price: number;
    description: string;
    imageUrl?: string | null;
    badge?: string;
    accentClassName: string;
}

export interface MyPointItem {
    id: number;
    itemId: number;
    name: string;
    category: PointItemCategory;
    acquiredAt: string;
    isUsing: boolean;
    imageUrl?: string | null;
    accentClassName: string;
}
