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
    paymentId: string;
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
