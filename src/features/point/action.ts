"use server";

import { revalidatePath } from "next/cache";

import {
    createPointOrderService,
    getPointStoreItemsService,
    getProfileOrderListService,
} from "@/app/services/point/service";
import {
    CreatePointOrderRequest,
    CreatePointOrderResponse,
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
            return await getProfileOrderListService();
        } catch (error) {
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

export const createPointOrderAction = async (
    payload: CreatePointOrderRequest
): Promise<CreatePointOrderResponse> => {
    try {
        const result = await createPointOrderService(payload);

        revalidatePath("/student/point-store");
        revalidatePath("/student/mypage/edit");
        revalidatePath("/student/mypage");

        return result;
    } catch (error) {
        return {
            timestamp: new Date().toISOString(),
            status: 500,
            code: "POINT-ORDER-CREATE-FAILED",
            message:
                error instanceof Error
                    ? error.message
                    : "구매에 실패했습니다.",
            data: null,
        };
    }
};
