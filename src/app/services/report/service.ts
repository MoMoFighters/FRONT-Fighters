// 관리자 - 신고 관련
/*
 - 신고 일부 조회(대시보드용)
 - 신고 전체 목록 조회(페이지네이션) - m4
*/

import { CreateReportApiResponse, CreateReportRequest, Report } from "@/features/report/type";
import { fetchWithAuth } from "@/lib/api";

export const getReports = async (): Promise<Report[]> => {
    const response = await fetchWithAuth('/api/v1/reports?limit=10');

    console.log(response.status);

    if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);

        throw new Error(
            `${errorData.status}|${errorData.message}`
        );
    }

    const result = await response.json();
    console.log('신고 목록 조회용', result);

    return result.data.items;
}

// 수강생, 강사 공통
/*
 - 신고 작성

*/

export const CreateReport = async (payload: CreateReportRequest): Promise<CreateReportApiResponse> => {

    console.log('전송 payload', payload);

    const response = await fetchWithAuth('/api/v1/reports', {
        method: "POST",
        body: JSON.stringify(payload)
    });

    console.log('응답 상태', response.status);

    if (!response.ok) {
        const text = await response.text();

        console.log('에러 응답 원본');
        console.log(text);

        throw new Error(text);
    }

    const result = await response.json();
    console.log('신고 접수', result);

    return result;
}