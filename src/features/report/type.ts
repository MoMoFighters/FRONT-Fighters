// 신고 대상 타입 정의
export type TargetType = "LECTURE" | "CHAPTER" | "POST" | "REVIEW" | "COMMENT" | "CHAT" | "PAGE";

// 신고 사유 타입 정의
export type ReasonRequest = "SPAM" | "ABUSE" | "INAPPROPRIATE" | "COPYRIGHT" | "OTHER";

export type ReasonResponse = "스팸/광고" | "욕설/혐오 표현" | "부적절한 내용" | "저작권 침해" | "기타";

export const REPORT_REASON_OPTIONS: { value: ReasonRequest; label: ReasonResponse }[] = [
    { value: "SPAM", label: "스팸/광고" },
    { value: "ABUSE", label: "욕설/혐오 표현" },
    { value: "INAPPROPRIATE", label: "부적절한 내용" },
    { value: "COPYRIGHT", label: "저작권 침해" },
    { value: "OTHER", label: "기타" },
];

export interface ReportList {
    reportId: number;
    reporterUserId: number;
    reporterName: string;
    reason: ReasonResponse;
    detail: string;
    targetType?: TargetType;
    targetId?: number;
    targetContent?: string;
    isResolved: boolean;
    reportedAt?: string;
    createdAt?: string;
}

export interface ReportListRequest {
    page: number;
    size?: number;
    isResolved?: boolean;
}

export interface ReportListResponse {
    items: ReportList[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface ReportDetail {
    reportId: number;
    reporterUserId: number;
    reporterName: string;
    reportedUserId?: number;
    reportedName?: string;
    targetType: TargetType;
    parentId?: number;  // targetType 이 CHAPTER 인 경우에만 lectureId를 추가로 받아오기 위함.
    targetId?: number;
    targetPath?: string;
    targetContent?: string;
    createdAt: string;  // 신고 접수 시각
    reason: ReasonResponse;
    detail: string;
    isResolved: boolean;
    resolvedAt?: string; // 신고 처리 시각
    isDeleted?: boolean;
}

export interface CreateReportRequest {
    targetType: TargetType;
    targetId?: number;
    targetPath?: string;
    reportedUserId?: number;
    reason: ReasonRequest;
    detail: string;
}

export interface CreateReportApiResponse {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data?: null;
}

export type Report = ReportList;

export type ReportTargetType = TargetType;

export interface AdminReportListItem {
    id: number;
    reason: ReasonResponse;
    detail: string;
    reporterName: string;
    createdAt: string;
    isResolved: boolean;
    targetType?: TargetType;
    targetId?: number;
}

export interface AdminReportDetail extends AdminReportListItem {
    reporterUserId?: number;
    reportedUserId?: number;
    reportedName?: string;
    targetType: TargetType;
    parentId?: number;
    targetId?: number;
    targetPath?: string;
    originalPath?: string;
    adminTargetPath?: string;
    targetAuthorName?: string;
    targetContent?: string;
    targetDeleted?: boolean;
    targetDeletedAt?: string;
    resolvedAt?: string;
    isDeleted?: boolean;
}

export type AdminReportListResponse = ReportListResponse;

export type ReportActionResult = {
    success: boolean;
    message?: string;
};

