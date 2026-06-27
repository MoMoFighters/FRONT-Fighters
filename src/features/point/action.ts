"use server";

import {
    getPointStoreItemsService,
    getProfileOrderListService,
} from "@/app/services/point/service";
import {
    PointStoreListResponse,
    ProfileOrderListResponse,
} from "./type";

export const getPointStoreItemsAction = async ({
    page,
    size,
}: {
    page: number;
    size: number;
}): Promise<PointStoreListResponse> => {
    try {
        return await getPointStoreItemsService({
            page,
            size,
        });
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

export const getProfileOrderListAction =
    async (): Promise<ProfileOrderListResponse> => {
        try {
            const a = await getProfileOrderListService();
            console.log(a, "내꺼");
            return a;
        } catch (error) {
            console.log(error, '에러')
            return {
                timestamp: new Date().toISOString(),
                status: 500,
                code: "PROFILE-ORDER-LIST-FAILED",
                message:
                    error instanceof Error
                        ? error.message
                        : "프로필 아이템 목록을 불러오지 못했습니다.",
            };
        }
    };
