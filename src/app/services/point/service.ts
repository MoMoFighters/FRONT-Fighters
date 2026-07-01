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

        const storeResponse = await fetchWithAuth(
            "/api/v1/store/product/list?page=1&size=100",
            {
                method: "GET",
            }
        );
        const storeResult: PointStoreListResponse = storeResponse.ok
            ? await storeResponse.json()
            : {
                timestamp: new Date().toISOString(),
                status: storeResponse.status,
                code: "POINT-STORE-LIST-FAILED",
                message: "",
            };
        const storeNameByImageUrl = new Map(
            (storeResult.data?.stores ?? [])
                .filter((item) => item.url && item.name)
                .map((item) => [item.url, item.name])
        );

        const normalizeProfileItems = (
            items: Array<{
                itemName?: string | null;
                item_name?: string | null;
                name?: string | null;
                productName?: string | null;
                product_name?: string | null;
                imageUrl?: string | null;
                image_url?: string | null;
            }> = []
        ) =>
            items
                .map((item) => {
                    const imageUrl =
                        item.imageUrl ?? item.image_url ?? null;
                    const itemName =
                        item.itemName ??
                        item.item_name ??
                        item.name ??
                        item.productName ??
                        item.product_name ??
                        (imageUrl ? storeNameByImageUrl.get(imageUrl) : "") ??
                        "";

                    return {
                        itemName,
                        imageUrl,
                    };
                })
                .filter(
                    (item) =>
                        item.itemName.trim().length > 0 &&
                        Boolean(item.imageUrl)
                );

        return {
            ...result,
            data: result.data
                ? {
                    owned: normalizeProfileItems(result.data.owned),
                    notOwned: normalizeProfileItems(result.data.notOwned),
                }
                : result.data,
        };
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
