import { AdminNotice, AdminNoticeDetail } from "@/features/notice/type";

export const DUMMY_NOTICES: AdminNotice[] = [
    // TODO: 공지사항 전체 조회 API 응답으로 교체한다.
    { noticeId: 125, title: "MoMoCITY 서비스 점검 안내 (6/23 월요일 02:00~04:00)", createdAt: "2026-06-20", viewCount: 1248 },
    { noticeId: 124, title: "개인정보처리방침 변경 안내", createdAt: "2026-06-18", viewCount: 862 },
    { noticeId: 123, title: "강의 콘텐츠 저작권 보호 및 이용 안내", createdAt: "2026-06-15", viewCount: 573 },
    { noticeId: 122, title: "2026년 6월 신규 기능 업데이트 안내", createdAt: "2026-06-12", viewCount: 1035 },
    { noticeId: 121, title: "커뮤니티 운영 정책 개정 안내", createdAt: "2026-06-09", viewCount: 468 },
    { noticeId: 120, title: "MoMoCITY 모바일 앱 업데이트 안내", createdAt: "2026-06-07", viewCount: 721 },
    { noticeId: 119, title: "가정의 달 특별 이벤트 안내", createdAt: "2026-06-04", viewCount: 1306 },
    { noticeId: 118, title: "강의 수강 환경 개선 안내", createdAt: "2026-06-01", viewCount: 392 },
    { noticeId: 117, title: "서비스 이용약관 변경 안내", createdAt: "2026-05-28", viewCount: 654 },
    { noticeId: 116, title: "2026년 상반기 고객 만족도 조사 안내", createdAt: "2026-05-25", viewCount: 387 },
    { noticeId: 115, title: "일부 브라우저 환경 지원 종료 안내", createdAt: "2026-05-22", viewCount: 410 },
    { noticeId: 114, title: "수강평 운영 정책 안내", createdAt: "2026-05-19", viewCount: 576 },
    { noticeId: 113, title: "고객센터 문의 처리 지연 안내", createdAt: "2026-05-16", viewCount: 239 },
    { noticeId: 112, title: "로그인 보안 정책 강화 안내", createdAt: "2026-05-13", viewCount: 1083 },
    { noticeId: 111, title: "강사 강의 등록 가이드 업데이트", createdAt: "2026-05-10", viewCount: 450 },
    { noticeId: 110, title: "포인트 적립 정책 변경 안내", createdAt: "2026-05-07", viewCount: 918 },
    { noticeId: 109, title: "커뮤니티 신고 기능 개선 안내", createdAt: "2026-05-04", viewCount: 332 },
    { noticeId: 108, title: "동영상 재생 오류 조치 안내", createdAt: "2026-05-01", viewCount: 713 },
    { noticeId: 107, title: "어린이날 고객센터 휴무 안내", createdAt: "2026-04-29", viewCount: 521 },
    { noticeId: 106, title: "신규 카테고리 예술 강의 오픈 안내", createdAt: "2026-04-25", viewCount: 1422 },
    { noticeId: 105, title: "정기 시스템 점검 완료 안내", createdAt: "2026-04-22", viewCount: 635 },
];

export const getDummyNoticeDetail = (noticeId: number): AdminNoticeDetail | undefined => {
    const notice = DUMMY_NOTICES.find((item) => item.noticeId === noticeId);

    if (!notice) return undefined;

    const defaultContent = [
        "안녕하세요, MoMoCITY입니다.",
        "서비스 이용과 관련된 주요 사항을 안내드립니다. 아래 내용을 확인해 주시기 바랍니다.",
        "더 나은 학습 경험을 제공할 수 있도록 지속적으로 서비스를 개선하겠습니다. 감사합니다.",
    ];

    const contentByNoticeId: Record<number, string[]> = {
        125: [
            "안녕하세요, MoMoCITY입니다.",
            "보다 안정적인 서비스 제공을 위해 아래와 같이 정기 시스템 점검을 진행합니다.",
            "점검 일시: 2026년 6월 23일 월요일 02:00 ~ 04:00\n점검 중에는 웹과 앱 서비스 이용이 일시적으로 제한될 수 있습니다.",
            "이용에 불편을 드려 죄송합니다. 더 안정적인 서비스로 찾아뵙겠습니다.",
        ],
        124: [
            "안녕하세요, MoMoCITY입니다.",
            "개인정보처리방침 일부 내용이 변경되어 안내드립니다.",
            "변경 사항은 서비스 내 개인정보처리방침에서 확인할 수 있으며, 변경된 방침은 2026년 6월 28일부터 적용됩니다.",
            "앞으로도 회원 정보 보호를 위해 최선을 다하겠습니다.",
        ],
    };

    return {
        ...notice,
        content: contentByNoticeId[noticeId] ?? defaultContent,
    };
};
