import { AdminPaymentRequest, AdminPaymentResponse } from "@/features/admin/payment/type";
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