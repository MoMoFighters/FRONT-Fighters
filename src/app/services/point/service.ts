import { fetchWithAuth } from "@/lib/api";
import {
    CreatePointOrderRequest,
    CreatePointOrderResponse,
    PointStoreListResponse,
    ProfileOrderListResponse,
} from "@/features/point/type";

export const getPointStoreItemsService = async ({
    page,
    size,
}: {
    page: number;
    size: number;
}): Promise<PointStoreListResponse> => {
    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
    });

    const response = await fetchWithAuth(`/api/v1/store/product/list?${params.toString()}`, {
        method: "GET",
    });

    const result: PointStoreListResponse = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "상품 목록을 불러오지 못했습니다.");
    }

    return result;
};

export const getProfileOrderListService =
    async (): Promise<ProfileOrderListResponse> => {
        const response = await fetchWithAuth("/api/v1/order/profile/list", {
            method: "GET",
        });

        const result: ProfileOrderListResponse = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "프로필 아이템 목록을 불러오지 못했습니다.");
        }

        return result;
    };

export const createPointOrderService = async (
    payload: CreatePointOrderRequest
): Promise<CreatePointOrderResponse> => {
    const response = await fetchWithAuth("/api/v1/order/new", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    const result: CreatePointOrderResponse = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "구매에 실패했습니다.");
    }

    return result;
};
