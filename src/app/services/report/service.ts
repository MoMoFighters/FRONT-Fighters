// 관리자 - 신고 관련
/*
 - 신고 일부 조회(대시보드용)
 - 신고 전체 목록 조회(페이지네이션) - m4
*/

import {
    CreateReportApiResponse,
    CreateReportRequest,
    Report,
    ReportDetail,
    ReportListRequest,
    ReportListResponse,
} from "@/features/report/type";
import { fetchWithAuth } from "@/lib/api";

const parseResponse = async <T>(response: Response): Promise<T> => {
    const text = await response.text();
    const result = text ? JSON.parse(text) : null;

    if (!response.ok) {
        const message = result?.message ?? response.statusText ?? "요청 처리에 실패했습니다.";
        throw new Error(`${response.status}|${message}`);
    }

    return result as T;
};

export const getReports = async (): Promise<Report[]> => {
    const response = await fetchWithAuth('/api/v1/reports?limit=10', {
        cache: "no-store",
    });

    const result = await parseResponse<{ data: { items: Report[] } }>(response);

    return result.data.items;
}

export const getReportList = async ({
    page,
    size,
    isResolved,
}: ReportListRequest): Promise<ReportListResponse> => {
    const params = new URLSearchParams({
        page: String(page),
    });

    if (size !== undefined) {
        params.set("size", String(size));
    }

    if (typeof isResolved === "boolean") {
        params.set("isResolved", String(isResolved));
    }

    const response = await fetchWithAuth(`/api/v1/reports?${params.toString()}`, {
        cache: "no-store",
    });
    const result = await parseResponse<{ data: ReportListResponse }>(response);

    return result.data;
};

export const getReportDetail = async (reportId: string): Promise<ReportDetail> => {
    const response = await fetchWithAuth(`/api/v1/reports/${reportId}`, {
        cache: "no-store",
    });
    const result = await parseResponse<{ data: ReportDetail }>(response);

    return result.data;
};

export const resolveReport = async (reportId: string) => {
    const response = await fetchWithAuth(`/api/v1/reports/${reportId}/resolve`, {
        method: "PATCH",
    });

    return parseResponse(response);
};

// 수강생, 강사 공통
/*
 - 신고 작성

*/

export const CreateReport = async (payload: CreateReportRequest): Promise<CreateReportApiResponse> => {

    const response = await fetchWithAuth('/api/v1/reports', {
        method: "POST",
        body: JSON.stringify(payload)
    });

    return parseResponse<CreateReportApiResponse>(response);
}
