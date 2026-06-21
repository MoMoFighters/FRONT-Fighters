// 🍑🍑🍑 홍근 민섭 상의 후 결정 🍑🍑🍑

export interface Report {
    reportId: number,
    reporterUserId: number,
    targetType: string,
    targetId: number,
    reason: string,
    detail: string,
    status: string,
    reportedAt: string
}

export interface CreateReportRequest {
    targetType: string,
    targetId: number,
    reason: string,
    detail: string
}

export interface CreateReportApiResponse {
    timestamp: string,
    status: number,
    code: string,
    message: string,
}

// TODO: 신고 목록 조회 API 명세가 확정되면 이 목록 전용 응답 타입으로 교체한다.
export interface AdminReportListItem {
    id: number;
    reason: string;
    detail: string;
    reporterName: string;
    createdAt: string;
    isResolved: boolean;
}
