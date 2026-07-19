export const PORTONE_STORE_ID = "store-6c5d0e0a-cca7-427c-8e72-343ca91be036";

export const PORTONE_EASY_PAY_PROVIDER = {
    KAKAOPAY: "KAKAOPAY",
    TOSSPAY: "TOSSPAY",
} as const;

export type PortOneEasyPayProvider =
    (typeof PORTONE_EASY_PAY_PROVIDER)[keyof typeof PORTONE_EASY_PAY_PROVIDER];

export const PORTONE_CHANNEL_KEY: Record<PortOneEasyPayProvider, string> = {
    KAKAOPAY: "channel-key-fa889757-73d2-4e8f-832c-3a9c74949d83",
    TOSSPAY: "channel-key-c4010451-bced-4dd2-9ba6-42ef251414b3",
};
