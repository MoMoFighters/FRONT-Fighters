// 관리자 결제 내역 타입 정의
export interface AdminPayment {
    paymentId: number;
    userName: string;
    price: number;
    status: "SUCCESS" | "REFUND";
    plan: "BASIC" | "PLUS" | "PRO";
    createdAt: string;
}

// 관리자 결제 내역 요청 쿼리 파라미터 타입 정의
export interface AdminPaymentRequest {
    status?: "SUCCESS" | "REFUND";
    page?: number;
    size?: number;
}

// 관리자 결제 내역 응답값 타입 정의
export interface AdminPaymentResponse {
    payments: AdminPayment[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}