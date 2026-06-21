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

export type ReportTargetType = "COMMENT" | "REVIEW" | "CHAT" | "PAGE";

// TODO: 신고 상세 조회 API 명세가 확정되면 이 타입을 실제 응답 구조에 맞춰 조정한다.
export interface AdminReportDetail extends AdminReportListItem {
    resolvedAt?: string;
    targetType: ReportTargetType;
    targetId?: number;
    targetAuthorName?: string;
    targetContent?: string;
    targetDeleted?: boolean;
    targetDeletedAt?: string;
    adminTargetPath?: string;
}
