import { MembershipPlan } from "./type";

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
    {
        tier: "BASIC",
        name: "BASIC",
        price: 0,
        description: "모모시티를 가볍게 둘러보기",
        features: [
            "커뮤니티 조회 및 글 작성",
            "개인 캘린더 활용",
            "친구와의 채팅",
        ],
    },
    {
        tier: "PLUS",
        name: "PLUS",
        price: 29900,
        originalPrice: 34900,
        description: "강의와 커뮤니티를 폭넓게 이용",
        features: [
            "베이직 혜택 모두 포함",
            "도시 성장 기능",
            "강의 수강",
            "강의평 작성",
            "잔디 기능",
        ],
    },
    {
        tier: "PRO",
        name: "PRO",
        price: 49900,
        originalPrice: 64900,
        description: "챗봇을 마음껏, 제한 없이",
        features: [
            "PLUS 혜택 모두 포함",
            "AI 챗봇 MoAi 이용",
            "AI 강의 요약 및 설명 기능",
        ],
    },
];
