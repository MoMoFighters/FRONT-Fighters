import type { ApiResponse } from "@/lib/api";

export type PointItemCategory = "PROFILE";
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
    imageUrl?: string | null;
    accentClassName: string;
}

export interface PointStoreApiItem {
    id: number;
    name: string;
    price: number;
    url: string | null;
    type: PointItemCategory;
}

export interface PointStoreListData {
    stores: PointStoreApiItem[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export type PointStoreListResponse =
    ApiResponse<PointStoreListData>;

export interface ProfileOrderItem {
    itemName: string;
    imageUrl: string | null;
}

export interface ProfileOrderListData {
    owned: ProfileOrderItem[];
    notOwned: ProfileOrderItem[];
}

export type ProfileOrderListResponse =
    ApiResponse<ProfileOrderListData>;

export type PointOrderReason =
    | "COMPLETE"
    | "REVIEW"
    | "PROFILE"
    | "BUS"
    | "GUESTBOOK";

export interface CreatePointOrderRequest {
    reason: PointOrderReason;
    itemName: string;
}

export type CreatePointOrderResponse =
    ApiResponse<null>;

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
