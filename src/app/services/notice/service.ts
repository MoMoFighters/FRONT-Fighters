import { CreateNoticeRequest, Notice, NoticeListResponse, UpdateNoticeRequest } from "@/features/notice/type";
import { ApiResponse, fetchWithAuth } from "@/lib/api";
import { notFound } from "next/navigation";

/**
 * 에러핸들링을 진행하는 공통 함수
 * @param response
 * @returns X -> 에러를 던짐
 */
const handleErrorResponse = async (response: Response) => {
    if (response.status === 404) {
        notFound();
    }

    if (!response.ok) {
        const errorText = await response.text();
        let message = response.statusText || "요청 처리에 실패했습니다.";

        if (errorText) {
            try {
                const errorData = JSON.parse(errorText) as {
                    status?: number;
                    message?: string;
                };

                message = errorData.message ?? message;
            } catch {
                message = errorText;
            }
        }

        throw new Error(
            `${response.status}|${message}`
        );
    }
};

/**
 * 에러가 나지 않았을 때 돌려주는 응답값을 정의하는 공통 함수
 * @param result
 * @returns result.data
 */
const assertApiData = <T>(result: ApiResponse<T>): T => {
    if (!result.data) {
        throw new Error(result.message);
    }

    return result.data;
};

const parseJsonOrNull = async (response: Response) => {
    if (response.status === 204) {
        return null;
    }

    const text = await response.text();

    if (!text) {
        return null;
    }

    return JSON.parse(text);
};

/**
 * 공지사항 전체 조회 api
 * @param page 페이지네이션
 * @returns NoticeListResponse
 */
export const getNotices = async (page: number): Promise<NoticeListResponse> => {
    const params = new URLSearchParams();
    params.set("page", String(page));

    const response = await fetchWithAuth(`/api/v1/admin-notices?${params.toString()}`);
    await handleErrorResponse(response);
    const result: ApiResponse<NoticeListResponse> = await response.json();
    return assertApiData(result);
};

/**
 * 공지사항 상세 조회 api
 * @param id 상세 조회할 공지사항 id
 * @returns Notice
 */
export const getNoticeById = async (id: string): Promise<Notice> => {
    const response = await fetchWithAuth(`/api/v1/admin-notices/${id}`);

    await handleErrorResponse(response);
    const result: ApiResponse<Notice> = await response.json();
    return assertApiData(result);
};

/**
 * 공지사항 등록 api
 * @param payload 등록하려는 공지사항 폼데이터
 * @returns 
 */
export const createNotice = async (payload: CreateNoticeRequest) => {
    const response = await fetchWithAuth('/api/v1/admin-notices', {
        method: "POST",
        body: JSON.stringify(payload)
    });

    await handleErrorResponse(response);
    return parseJsonOrNull(response);
};

/**
 * 공지사항 수정 api
 * @param id 수정할 공지사항 id
 * @param payload 수정할 공지사항 폼데이터
 * @returns 
 */
export const updateNoticeById = async (id: string, payload: UpdateNoticeRequest) => {
    const response = await fetchWithAuth(`/api/v1/admin-notices/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
    });

    await handleErrorResponse(response);
    return parseJsonOrNull(response);
};

/**
 * 공지사항 고정 api
 * @param id 고정하고 싶은 공지사항 id
 * @returns
 */
export const pinNoticeById = async (id: string) => {
    const response = await fetchWithAuth(`/api/v1/admin-notices/${id}/pin`, {
        method: "PATCH"
    });

    await handleErrorResponse(response);
    return parseJsonOrNull(response);
};

/**
 * 공지사항 고정 해제 api
 * @param id 고정 해제하고 싶은 공지사항 id
 * @returns
 */
export const unPinNoticeById = async (id: string) => {
    const response = await fetchWithAuth(`/api/v1/admin-notices/${id}/unpin`, {
        method: "PATCH"
    });

    await handleErrorResponse(response);
    return parseJsonOrNull(response);
};

/**
 * 공지사항 단건 삭제 api
 * @param id 삭제하려는 공지사항 id
 * @returns
 */
export const deleteNoticeById = async (id: string) => {
    const response = await fetchWithAuth(`/api/v1/admin-notices/${id}`, {
        method: "DELETE"
    });

    await handleErrorResponse(response);
    return parseJsonOrNull(response);
};

/**
 * 공지사항 일괄 삭제 api
 * @param ids 삭제하려는 공지사항 id 들
 * @returns 
 */
export const deleteNoticeByIds = async (ids: string[]) => {
    const response = await fetchWithAuth('/api/v1/admin-notices/', {
        method: "DELETE",
        body: JSON.stringify(ids)
    });

    await handleErrorResponse(response);
    return parseJsonOrNull(response);
};
