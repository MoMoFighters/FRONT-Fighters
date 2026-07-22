import { MembershipTier } from "@/features/membership/type";

const TIER_ORDER: Record<MembershipTier, number> = {
    BASIC: 0,
    PLUS: 1,
    PRO: 2,
};

const MEMBERSHIP_PERIOD_DAYS = 30;
const MINIMUM_PAYMENT_AMOUNT = 100;

const toLocalMidnight = (date: Date) => {
    const midnight = new Date(date);
    midnight.setHours(0, 0, 0, 0);
    return midnight;
};

interface CalculateDisplayPriceInput {
    currentTier: MembershipTier;
    currentPrice: number;
    targetTier: MembershipTier;
    targetPrice: number;
    membershipStart: string | null | undefined;
}

/**
 * 결제창에 보여줄 예상 결제 금액을 계산한다.
 * 실제 청구 금액은 항상 서버 /prepare 응답을 기준으로 하며, 이 값은 미리보기 용도다.
 *
 * 정책 (PaymentPolicy.java 기준):
 * - BASIC 기준이거나, 같은 플랜/다운그레이드거나, membershipStart가 없으면 정가.
 * - 그 외(PLUS -> PRO 같은 업그레이드)만 (targetPrice - currentPrice) * 잔여일수 / 30 만큼 비례 계산.
 * - 잔여일수는 membershipStart + 30일(만료일) 기준으로 오늘부터 만료일까지 날짜 단위(내림)로 계산.
 * - 이미 만료된 경우 정가.
 * - 최소 결제 금액 100원 보장.
 */
export const calculateDisplayPrice = ({
    currentTier,
    currentPrice,
    targetTier,
    targetPrice,
    membershipStart,
}: CalculateDisplayPriceInput): number => {
    const isUpgrade = TIER_ORDER[targetTier] > TIER_ORDER[currentTier];

    if (currentTier === "BASIC" || !isUpgrade || !membershipStart) {
        return targetPrice;
    }

    const startDate = new Date(membershipStart);

    if (Number.isNaN(startDate.getTime())) {
        return targetPrice;
    }

    const expiresAt = new Date(startDate);
    expiresAt.setDate(expiresAt.getDate() + MEMBERSHIP_PERIOD_DAYS);

    const remainingDays = Math.floor(
        (toLocalMidnight(expiresAt).getTime() - toLocalMidnight(new Date()).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (remainingDays <= 0) {
        return targetPrice;
    }

    const proratedPrice = Math.floor(
        ((targetPrice - currentPrice) * remainingDays) / MEMBERSHIP_PERIOD_DAYS
    );

    return Math.max(proratedPrice, MINIMUM_PAYMENT_AMOUNT);
};
