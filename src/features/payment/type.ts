import { MembershipTier } from "@/features/membership/type";

export interface PreparePaymentData {
    price: number;
    createdAt: string;
    paymentId: string;
}

export interface VerifyPaymentData {
    membershipUntil: string;
}

export type UserPaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUND";

export interface UserPaymentItem {
    // 문서화된 응답에는 없지만, 취소(환불) 시 필요한 값이라 실제 응답에 포함되어 있다고 가정한다.
    paymentId?: string;
    price: number;
    plan: MembershipTier;
    status: UserPaymentStatus;
    createdAt: string;
}

export interface UserPaymentListData {
    payments: UserPaymentItem[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}
