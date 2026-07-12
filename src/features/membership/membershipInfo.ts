import { MembershipPlan } from "./type";

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
    {
        tier: "BASIC",
        name: "BASIC",
        price: 0,
        description: "모모시티를 가볍게 둘러보기",
        features: [
            "커뮤니티 게시글 조회",
            "친구와 1:1 채팅",
            "단체 채팅",
        ],
    },
    {
        tier: "PRO",
        name: "PRO",
        price: 10000,
        description: "강의와 커뮤니티를 폭넓게 이용",
        features: [
            "BASIC 혜택 모두 포함",
            "강의 수강",
            "커뮤니티 게시글 및 댓글 작성",
            "챗봇 기능 이용",
        ],
    },
    {
        tier: "PLUS",
        name: "PLUS",
        price: 30000,
        description: "챗봇을 마음껏, 제한 없이",
        features: [
            "PRO 혜택 모두 포함",
            "챗봇 무제한 이용",
        ],
    },
];
