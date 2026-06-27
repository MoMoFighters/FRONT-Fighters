"use server";

import { getPointStoreItemsService } from "@/app/services/point/service";
import { PointStoreListResponse } from "./type";

export const getPointStoreItemsAction = async ({
    page,
    size,
}: {
    page: number;
    size: number;
}): Promise<PointStoreListResponse> => {
    try {
        const a = await getPointStoreItemsService({
            page,
            size,
        });
        console.log(a, '포인트포인트');
        return a
    } catch (error) {
        return {
            timestamp: new Date().toISOString(),
            status: 500,
            code: "POINT-STORE-LIST-FAILED",
            message:
                error instanceof Error
                    ? error.message
                    : "상품 목록을 불러오지 못했습니다.",
        };
    }
};
