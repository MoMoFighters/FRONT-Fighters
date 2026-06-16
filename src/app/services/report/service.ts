// 관리자 - 신고 관련
/*
 - 신고 일부 조회(대시보드용)
 - 신고 전체 목록 조회(페이지네이션) - m4
*/

import { CreateReportApiResponse, CreateReportRequest, Report } from "@/features/report/type";
import { fetchWithAuth } from "@/lib/api";

export const getReports = async (): Promise<Report[]> => {
    const response = await fetchWithAuth('/api/v1/reports?limit=10');


    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            `${errorData.status}|${errorData.message}`
        );
    }

    const result = await response.json();

    return result.data.items;
}

// 수강생, 강사 공통
/*
 - 신고 작성

*/

export const CreateReport = async (payload: CreateReportRequest): Promise<CreateReportApiResponse> => {


    const response = await fetchWithAuth('/api/v1/reports', {
        method: "POST",
        body: JSON.stringify(payload)
    });


    if (!response.ok) {
        const text = await response.text();


        throw new Error(text);
    }

    const result = await response.json();

    return result;
}
