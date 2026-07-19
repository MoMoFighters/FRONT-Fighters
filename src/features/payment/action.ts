"use server";

import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";

import { ApiResponse } from "@/lib/api";
import {
    preparePaymentService,
    verifyPaymentService,
    cancelPaymentService,
    getUserPaymentListService,
} from "@/app/services/payment/service";
import { MembershipTier } from "@/features/membership/type";
import {
    PreparePaymentData,
    UserPaymentListData,
    VerifyPaymentData,
} from "./type";

const getUnauthorizedResponse = <T>(): ApiResponse<T> => ({
    timestamp: new Date().toISOString(),
    status: 401,
    code: "COMMON-UNAUTHORIZED",
    message: "로그인 세션이 만료되었습니다.",
});

export const preparePaymentAction = async (
    plan: MembershipTier
): Promise<ApiResponse<PreparePaymentData>> => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return getUnauthorizedResponse();
        }

        return await preparePaymentService(plan);
    } catch (error) {
        return {
            timestamp: new Date().toISOString(),
            status: 500,
            code: "PAYMENT_PREPARE_FAILED",
            message:
                error instanceof Error
                    ? error.message
                    : "결제 준비 중 오류가 발생했습니다.",
        };
    }
};

export const verifyPaymentAction = async (
    paymentId: string
): Promise<ApiResponse<VerifyPaymentData>> => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return getUnauthorizedResponse();
        }

        const result = await verifyPaymentService(paymentId);

        if (result.status === 200 || result.status === 201) {
            revalidateTag("my-info", { expire: 0 });
            revalidatePath("/student/mypage/membership");
            revalidatePath("/student/mypage");
        }

        return result;
    } catch (error) {
        return {
            timestamp: new Date().toISOString(),
            status: 500,
            code: "PAYMENT_VERIFY_FAILED",
            message:
                error instanceof Error
                    ? error.message
                    : "결제 검증 중 오류가 발생했습니다.",
        };
    }
};

export const cancelPaymentAction = async (
    paymentId: string
): Promise<ApiResponse<null>> => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return getUnauthorizedResponse();
        }

        const result = await cancelPaymentService(paymentId);

        if (result.status === 200) {
            revalidateTag("my-info", { expire: 0 });
            revalidatePath("/student/mypage/membership");
            revalidatePath("/student/mypage");
        }

        return result;
    } catch (error) {
        return {
            timestamp: new Date().toISOString(),
            status: 500,
            code: "PAYMENT_CANCEL_FAILED",
            message:
                error instanceof Error
                    ? error.message
                    : "결제 취소 중 오류가 발생했습니다.",
        };
    }
};

export const getUserPaymentListAction = async (
    status?: string
): Promise<ApiResponse<UserPaymentListData>> => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return getUnauthorizedResponse();
        }

        return await getUserPaymentListService(status);
    } catch (error) {
        return {
            timestamp: new Date().toISOString(),
            status: 500,
            code: "PAYMENT_LIST_FAILED",
            message:
                error instanceof Error
                    ? error.message
                    : "결제 내역을 불러오는 중 오류가 발생했습니다.",
        };
    }
};
