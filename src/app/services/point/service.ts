import { fetchWithAuth } from "@/lib/api";
import { PointStoreListResponse } from "@/features/point/type";

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
