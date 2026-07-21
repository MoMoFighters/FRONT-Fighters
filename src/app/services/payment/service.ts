import { AdminPaymentRequest, AdminPaymentResponse } from "@/features/admin/payment/type";
import {
    PreparePaymentData,
    UserPaymentListData,
    VerifyPaymentData,
} from "@/features/payment/type";
import { MembershipTier } from "@/features/membership/type";
import { ApiResponse, fetchWithAuth } from "@/lib/api";

/**
 * 관리자 결제 내역 전체 조회 api
 * @param payload 요청 쿼리 파라미터에 필요한 값 -> status, page
 * @returns AdminPaymentResponse
 */
export const getAdminPayment = async (payload: AdminPaymentRequest): Promise<AdminPaymentResponse> => {
    const queryString =
        new URLSearchParams(
            Object.entries(payload)
                .filter(([, value]) => value !== undefined)
                .map(([key, value]) => [
                    key,
                    String(value),
                ])
        ).toString();

    const response = await fetchWithAuth(`/api/v3/payment/admin/list?${queryString}`, {
        cache: "no-store",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}`);
    }

    const result: ApiResponse<AdminPaymentResponse> = await response.json();

    if (!result.data) {
        throw new Error("500|알 수 없는 오류가 발생했습니다.");
    }
    return result.data;
};

/**
 * 구독 결제 준비 api
 * 서버가 결제 예정 금액(price)과 paymentId를 미리 발급해두고,
 * 이후 /verify 단계에서 실제 결제 금액과 비교하는 데 사용된다.
 */
export const preparePaymentService = async (
    plan: MembershipTier
): Promise<ApiResponse<PreparePaymentData>> => {
    const response = await fetchWithAuth("/api/v3/payment/prepare", {
        method: "POST",
        body: JSON.stringify({ plan }),
    });

    return response.json();
};

/**
 * 결제 검증 api
 * 프론트가 아니라 서버가 포트원에 직접 재조회하여 금액 위변조를 막는다.
 */
export const verifyPaymentService = async (
    paymentId: string
): Promise<ApiResponse<VerifyPaymentData>> => {
    const response = await fetchWithAuth("/api/v3/payment/verify", {
        method: "POST",
        body: JSON.stringify({ paymentId }),
    });

    return response.json();
};

/**
 * 결제 취소(환불) api
 * 결제 후 3일 이내에만 환불 가능하며, 그 이후엔 membershipUntil까지 유지되다 BASIC으로 전환된다.
 */
export const cancelPaymentService = async (
    paymentId: string
): Promise<ApiResponse<null>> => {
    const response = await fetchWithAuth("/api/v3/payment/cancel", {
        method: "PATCH",
        body: JSON.stringify({ paymentId }),
    });

    return response.json();
};

/**
 * 내 결제 내역 조회 api
 */
export const getUserPaymentListService = async (
    status?: string
): Promise<ApiResponse<UserPaymentListData>> => {
    const queryString = status
        ? `?status=${encodeURIComponent(status)}`
        : "";

    const response = await fetchWithAuth(
        `/api/v3/payment/user/list${queryString}`,
        { cache: "no-store" }
    );

    return response.json();
};