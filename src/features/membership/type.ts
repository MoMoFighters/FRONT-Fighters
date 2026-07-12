export type MembershipTier = "BASIC" | "PRO" | "PLUS";

export interface MembershipPlan {
    tier: MembershipTier;
    name: string;
    price: number;
    description: string;
    features: string[];
}
