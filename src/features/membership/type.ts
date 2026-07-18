export type MembershipTier = "BASIC" | "PLUS" | "PRO";

export interface MembershipPlan {
    tier: MembershipTier;
    name: string;
    price: number;
    originalPrice?: number;
    description: string;
    features: string[];
}
