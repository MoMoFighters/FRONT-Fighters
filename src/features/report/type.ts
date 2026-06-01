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