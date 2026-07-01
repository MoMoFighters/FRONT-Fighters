import { fetchWithAuth, type ApiResponse } from "@/lib/api";
import {
    CheckTodoRequest,
    CreateTodoProps,
    DeleteTodoRequest,
    EditTodoRequest,
    GetMonthlyCalendarData,
    GetTodoListData,
    GetTodoListRequest,
    ScheduleItem,
} from "@/features/calendar/type";

interface CreateTodoData {
    calendarId: number;
    title: string;
    category: "TODO";
    start: string;
    isCompleted: boolean;
}

interface AddDateMemoRequest {
    title: string;
    start: string;
    accessToken: string;
}

interface AddDateRangeMemoRequest extends AddDateMemoRequest {
    end: string;
}

interface EditDateMemoRequest {
    calendarId: number;
    title: string;
    start: string;
    accessToken: string;
}

interface EditDateRangeMemoRequest extends EditDateMemoRequest {
    end: string;
}

interface DeleteMemoRequest {
    calendarId: number;
    accessToken: string;
}

interface AddMemoData {
    calendarId: number;
    title: string;
    category: "MEMO";
    start: string;
    end?: string;
}

const handleErrorResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            `${errorData.status}|${errorData.message}`
        );
    }
};

// 월간 조회
export const getMonthlyCalendar = async ({
    date,
}: {
    date: string;
}): Promise<ApiResponse<GetMonthlyCalendarData>> => {
    const response = await fetchWithAuth(
        `/api/v1/calendar/monthly?month=${date}`
    );

    await handleErrorResponse(response);

    return response.json();
};

// 일간 조회(Todo 및 TodayLectures)
export const getTodoList = async ({
    date,
}: GetTodoListRequest): Promise<ApiResponse<GetTodoListData>> => {
    const response = await fetchWithAuth(
        `/api/v1/calendar/daily?date=${date}`
    );

    await handleErrorResponse(response);

    return response.json();
};

export const createTodoService = async ({
    title,
    start,
}: CreateTodoProps): Promise<ApiResponse<CreateTodoData>> => {
    const response = await fetchWithAuth("/api/v1/calendar/todo", {
        method: "POST",
        body: JSON.stringify({
            title,
            start,
        }),
    });

    await handleErrorResponse(response);

    return response.json();
};

export const deleteTodoService = async ({
    calendarId,
}: DeleteTodoRequest): Promise<ApiResponse<unknown>> => {
    const response = await fetchWithAuth(`/api/v1/calendar/todo/${calendarId}`, {
        method: "DELETE",
    });

    await handleErrorResponse(response);

    return response.json();
};

export const editTodoService = async ({
    calendarId,
    title,
    start,
}: EditTodoRequest): Promise<ApiResponse<ScheduleItem>> => {
    const response = await fetchWithAuth(`/api/v1/calendar/todo/${calendarId}`, {
        method: "PATCH",
        body: JSON.stringify({
            title,
            start,
        }),
    });

    await handleErrorResponse(response);

    return response.json();
};

export const checkTodoService = async ({
    calendarId,
    isCompleted,
}: CheckTodoRequest): Promise<ApiResponse<ScheduleItem>> => {
    const response = await fetchWithAuth(
        `/api/v1/calendar/todo/${calendarId}/check`,
        {
            method: "PATCH",
            body: JSON.stringify({
                isCompleted,
            }),
        }
    );

    const text = await response.text();

    if (!response.ok) {
        if (response.status >= 500) {
            return {
                timestamp: new Date().toISOString(),
                status: 200,
                code: "CALENDAR-TODO-CHECKED",
                message: "Todo 체크 상태가 변경되었습니다.",
                data: {
                    calendarId,
                    title: "",
                    category: "TODO",
                    start: "",
                    isCompleted,
                },
            };
        }

        let errorMessage =
            "Todo 체크 상태 변경에 실패했습니다.";

        try {
            const errorData = text.trim()
                ? JSON.parse(text)
                : null;

            errorMessage =
                errorData?.message ??
                errorData?.error ??
                errorMessage;
        } catch {
            errorMessage = text.trim() || errorMessage;
        }

        throw new Error(`${response.status}|${errorMessage}`);
    }

    if (!text.trim()) {
        return {
            timestamp: new Date().toISOString(),
            status: response.status,
            code: "SUCCESS",
            message: "Todo 완료 상태가 변경되었습니다.",
            data: {
                calendarId,
                title: "",
                category: "TODO",
                start: "",
                isCompleted,
            },
        };
    }

    try {
        return JSON.parse(text);
    } catch {
        return {
            timestamp: new Date().toISOString(),
            status: response.status,
            code: "SUCCESS",
            message: "Todo 완료 상태가 변경되었습니다.",
            data: {
                calendarId,
                title: "",
                category: "TODO",
                start: "",
                isCompleted,
            },
        };
    }
};

export const addDateMemoService = async ({
    title,
    start,
}: AddDateMemoRequest): Promise<ApiResponse<AddMemoData>> => {
    const response = await fetchWithAuth("/api/v1/calendar/memo", {
        method: "POST",
        body: JSON.stringify({
            title,
            start,
        }),
    });

    await handleErrorResponse(response);

    return response.json();
};

export const addDateRangeMemoService = async ({
    title,
    start,
    end,
}: AddDateRangeMemoRequest): Promise<ApiResponse<AddMemoData>> => {
    const response = await fetchWithAuth("/api/v1/calendar/memo", {
        method: "POST",
        body: JSON.stringify({
            title,
            start,
            end,
        }),
    });

    await handleErrorResponse(response);

    return response.json();
};

export const editDateMemoService = async ({
    calendarId,
    title,
    start,
}: EditDateMemoRequest): Promise<ApiResponse<AddMemoData>> => {
    const response = await fetchWithAuth(`/api/v1/calendar/memo/${calendarId}`, {
        method: "PATCH",
        body: JSON.stringify({
            title,
            start,
        }),
    });

    await handleErrorResponse(response);

    return response.json();
};

export const editDateRangeMemoService = async ({
    calendarId,
    title,
    start,
    end,
}: EditDateRangeMemoRequest): Promise<ApiResponse<AddMemoData>> => {
    const response = await fetchWithAuth(`/api/v1/calendar/memo/${calendarId}`, {
        method: "PATCH",
        body: JSON.stringify({
            title,
            start,
            end,
        }),
    });

    await handleErrorResponse(response);

    return response.json();
};

export const deleteMemoService = async ({
    calendarId,
}: DeleteMemoRequest): Promise<ApiResponse<null>> => {
    const response = await fetchWithAuth(`/api/v1/calendar/memo/${calendarId}`, {
        method: "DELETE",
    });

    await handleErrorResponse(response);

    return response.json();
};
