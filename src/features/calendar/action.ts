'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import type { ApiResponse } from '@/lib/api';
import { addDateMemoService, addDateRangeMemoService, checkTodoService, createTodoService, deleteMemoService, deleteTodoService, editDateMemoService, editDateRangeMemoService, editTodoService, getMonthlyCalendar, getTodoList }
    from '@/app/services/phone/calendar/service';

import { GetCalendarSchedulesActionProps, ScheduleItem, TodayChapter }
    from './type';

const revalidateCalendarPaths = () => {
    revalidatePath('/student/calendar');
};





interface DailyCalendarActionData {
    todos: ScheduleItem[];
    todayChapters: TodayChapter[];
}

export const getMonthlyCalendarAction = async ({
    date,
}: GetCalendarSchedulesActionProps)
    : Promise<ScheduleItem[]> => {
    try {

        // 쿠키 가져오기
        const cookieStore =
            await cookies();

        const accessToken =
            cookieStore
                .get('accessToken')
                ?.value;


        // 토큰 없음
        if (!accessToken) {

            throw new Error(
                '로그인이 필요합니다.'
            );
        }


        const monthlyResult =
            await getMonthlyCalendar({
                date,
            });

        const monthlyData =
            monthlyResult.data;


        if (!monthlyData) {
            return [];
        }


        return [
            ...monthlyData.memos.map(
                (memo) => ({

                    calendarId: memo.calendarId,
                    title: memo.title,
                    category: "MEMO" as const,
                    start: memo.start,
                    end: memo.end
                })
            ),
        ];

    } catch (error) {

        console.error(
            '월별 캘린더 조회 실패:',
            error
        );

        return [];
    }
};

export const getDailyCalendarAction = async ({
    date,
}: GetCalendarSchedulesActionProps)
    : Promise<DailyCalendarActionData> => {
    try {

        const cookieStore =
            await cookies();

        const accessToken =
            cookieStore
                .get('accessToken')
                ?.value;


        if (!accessToken) {

            throw new Error(
                '로그인이 필요합니다.'
            );
        }


        const dailyResult =
            await getTodoList({
                date,
                accessToken,
            });


        const dailyData =
            dailyResult.data;


        if (!dailyData) {
            return {
                todos: [],
                todayChapters: [],
            };
        }


        return {
            todos: dailyData.todos.map(
                (todo) => ({

                    calendarId: todo.calendarId,
                    title: todo.title,
                    category: "TODO" as const,
                    start: todo.start,
                    isCompleted: todo.isCompleted
                })
            ),
            todayChapters: dailyData.todayChapters,
        };

    } catch (error) {

        console.error(
            '일별 캘린더 조회 실패:',
            error
        );

        return {
            todos: [],
            todayChapters: [],
        };
    }
};




interface CreateTodoActionRequest {
    title: string;
    start: string;
}

interface AddDateMemoActionRequest {
    title: string;
    start: string;
}

interface AddDateRangeMemoActionRequest extends AddDateMemoActionRequest {
    end: string;
}

interface EditDateMemoActionRequest extends AddDateMemoActionRequest {
    calendarId: number;
}

interface EditDateRangeMemoActionRequest extends EditDateMemoActionRequest {
    end: string;
}

interface DeleteMemoActionRequest {
    calendarId: number;
}

const createCalendarActionErrorResponse = <T = ScheduleItem>(
    status: number,
    code: string,
    message: string
): ApiResponse<T> => ({
    timestamp: new Date().toISOString(),
    status,
    code,
    message,
});






export const createTodoAction = async (
    {
        title,
        start,
    }: CreateTodoActionRequest
): Promise<ApiResponse<ScheduleItem>> => {

    try {

        // 쿠키 가져오기
        const cookieStore =
            await cookies();

        const accessToken =
            cookieStore
                .get('accessToken')
                ?.value;


        // 토큰 없음
        if (!accessToken) {

            return createCalendarActionErrorResponse(
                401,
                'UNAUTHORIZED',
                '로그인이 필요합니다.'
            );
        }


        // todo 생성
        const result =
            await createTodoService({
                title,
                start,
                accessToken,
            });

        return result;

    } catch (error) {

        return createCalendarActionErrorResponse(
            500,
            'CALENDAR_TODO_CREATE_FAILED',
            error instanceof Error
                ? error.message
                : 'Todo 등록에 실패하였습니다.'
        );
    }
};

export const addDateMemoAction = async (
    {
        title,
        start,
    }: AddDateMemoActionRequest
): Promise<ApiResponse<ScheduleItem>> => {

    try {

        // 쿠키 가져오기
        const cookieStore =
            await cookies();

        const accessToken =
            cookieStore
                .get('accessToken')
                ?.value;


        // 토큰 없음
        if (!accessToken) {

            return createCalendarActionErrorResponse(
                401,
                'UNAUTHORIZED',
                '로그인이 필요합니다.'
            );
        }


        // 하루 메모 생성
        const result =
            await addDateMemoService({
                title,
                start,
                accessToken,
            });


        return result;

    } catch (error) {

        return createCalendarActionErrorResponse(
            500,
            'CALENDAR_MEMO_CREATE_FAILED',
            error instanceof Error
                ? error.message
                : '메모 등록에 실패하였습니다.'
        );
    }
};

export const addDateRangeMemoAction = async (
    {
        title,
        start,
        end,
    }: AddDateRangeMemoActionRequest
): Promise<ApiResponse<ScheduleItem>> => {

    try {

        // 쿠키 가져오기
        const cookieStore =
            await cookies();

        const accessToken =
            cookieStore
                .get('accessToken')
                ?.value;


        // 토큰 없음
        if (!accessToken) {

            return createCalendarActionErrorResponse(
                401,
                'UNAUTHORIZED',
                '로그인이 필요합니다.'
            );
        }


        // 기간 메모 생성
        const result =
            await addDateRangeMemoService({
                title,
                start,
                end,
                accessToken,
            });


        return result;

    } catch (error) {

        return createCalendarActionErrorResponse(
            500,
            'CALENDAR_RANGE_MEMO_CREATE_FAILED',
            error instanceof Error
                ? error.message
                : '기간 메모 등록에 실패하였습니다.'
        );
    }
};

export const editDateMemoAction = async (
    {
        calendarId,
        title,
        start,
    }: EditDateMemoActionRequest
): Promise<ApiResponse<ScheduleItem>> => {

    try {

        const cookieStore =
            await cookies();

        const accessToken =
            cookieStore
                .get('accessToken')
                ?.value;


        if (!accessToken) {

            return createCalendarActionErrorResponse(
                401,
                'UNAUTHORIZED',
                '로그인이 필요합니다.'
            );
        }


        if (!calendarId) {

            return createCalendarActionErrorResponse(
                400,
                'INVALID_CALENDAR_ID',
                '잘못된 요청입니다.'
            );
        }


        if (!title.trim()) {

            return createCalendarActionErrorResponse(
                400,
                'INVALID_MEMO_TITLE',
                '수정할 제목은 필수 항목입니다.'
            );
        }


        const result =
            await editDateMemoService({
                calendarId,
                title,
                start,
                accessToken,
            });


        revalidateCalendarPaths();


        return result;

    } catch (error) {

        return createCalendarActionErrorResponse(
            500,
            'CALENDAR_MEMO_EDIT_FAILED',
            error instanceof Error
                ? error.message
                : '메모 수정에 실패하였습니다.'
        );
    }
};

export const editDateRangeMemoAction = async (
    {
        calendarId,
        title,
        start,
        end,
    }: EditDateRangeMemoActionRequest
): Promise<ApiResponse<ScheduleItem>> => {

    try {

        const cookieStore =
            await cookies();

        const accessToken =
            cookieStore
                .get('accessToken')
                ?.value;


        if (!accessToken) {

            return createCalendarActionErrorResponse(
                401,
                'UNAUTHORIZED',
                '로그인이 필요합니다.'
            );
        }


        if (!calendarId) {

            return createCalendarActionErrorResponse(
                400,
                'INVALID_CALENDAR_ID',
                '잘못된 요청입니다.'
            );
        }


        if (!title.trim()) {

            return createCalendarActionErrorResponse(
                400,
                'INVALID_MEMO_TITLE',
                '수정할 제목은 필수 항목입니다.'
            );
        }


        const result =
            await editDateRangeMemoService({
                calendarId,
                title,
                start,
                end,
                accessToken,
            });


        revalidateCalendarPaths();


        return result;

    } catch (error) {

        return createCalendarActionErrorResponse(
            500,
            'CALENDAR_RANGE_MEMO_EDIT_FAILED',
            error instanceof Error
                ? error.message
                : '기간 메모 수정에 실패하였습니다.'
        );
    }
};

export const deleteMemoAction = async (
    {
        calendarId,
    }: DeleteMemoActionRequest
): Promise<ApiResponse<null>> => {

    try {

        const cookieStore =
            await cookies();

        const accessToken =
            cookieStore
                .get('accessToken')
                ?.value;


        if (!accessToken) {

            return createCalendarActionErrorResponse<null>(
                401,
                'UNAUTHORIZED',
                '로그인이 필요합니다.'
            );
        }


        if (!calendarId) {

            return createCalendarActionErrorResponse<null>(
                400,
                'INVALID_CALENDAR_ID',
                '잘못된 요청입니다.'
            );
        }


        const result =
            await deleteMemoService({
                calendarId,
                accessToken,
            });


        revalidateCalendarPaths();


        return result;

    } catch (error) {

        return createCalendarActionErrorResponse<null>(
            500,
            'CALENDAR_MEMO_DELETE_FAILED',
            error instanceof Error
                ? error.message
                : '메모 삭제에 실패하였습니다.'
        );
    }
};


export const deleteTodoAction = async (
    calendarId: number
): Promise<ApiResponse<unknown>> => {

    try {

        // 쿠키 가져오기
        const cookieStore =
            await cookies();

        const accessToken =
            cookieStore
                .get('accessToken')
                ?.value;


        // 토큰 없음
        if (!accessToken) {

            return createCalendarActionErrorResponse<unknown>(
                401,
                'UNAUTHORIZED',
                '로그인이 필요합니다.'
            );
        }


        // calendarId 검증
        if (!calendarId) {

            return createCalendarActionErrorResponse<unknown>(
                400,
                'INVALID_CALENDAR_ID',
                '잘못된 요청입니다.'
            );
        }


        // 삭제 서비스 호출
        const result =
            await deleteTodoService({
                calendarId,
                accessToken,
            });


        // 캐시 갱신
        revalidateCalendarPaths();


        // 페이지 이동
        // redirect('/calendar');


        return result;

    } catch (error) {

        return createCalendarActionErrorResponse<unknown>(
            500,
            'CALENDAR_TODO_DELETE_FAILED',
            error instanceof Error
                ? error.message
                : '알 수 없는 오류가 발생했습니다.'
        );
    }
};


export interface EditTodoActionRequest {
    calendarId: number;
    title: string;
    start: string;
}

export const editTodoAction = async ({
    calendarId,
    title,
    start
}: EditTodoActionRequest): Promise<ApiResponse<ScheduleItem>> => {

    try {

        // 쿠키 가져오기
        const cookieStore =
            await cookies();

        const accessToken =
            cookieStore
                .get('accessToken')
                ?.value;


        // 토큰 없음
        if (!accessToken) {

            return createCalendarActionErrorResponse(
                401,
                'UNAUTHORIZED',
                '로그인이 필요합니다.'
            );
        }


        // calendarId 검증
        if (!calendarId) {

            return createCalendarActionErrorResponse(
                400,
                'INVALID_CALENDAR_ID',
                '잘못된 요청입니다.'
            );
        }


        // 제목 검증
        if (!title.trim()) {

            return createCalendarActionErrorResponse(
                400,
                'INVALID_TODO_TITLE',
                'Todo 제목을 입력해주세요.'
            );
        }


        // 서비스 호출
        const result =
            await editTodoService({
                calendarId:
                    Number(calendarId),

                accessToken,

                title,

                start
            });


        return result;

    } catch (error) {

        return createCalendarActionErrorResponse(
            500,
            'CALENDAR_TODO_EDIT_FAILED',
            error instanceof Error
                ? error.message
                : '알 수 없는 오류가 발생했습니다.'
        );
    }
};



export interface CheckTodoActionRequest {
    calendarId: number;
    isCompleted: boolean;
}


export const checkTodoAction = async ({
    calendarId,
    isCompleted,
}: CheckTodoActionRequest): Promise<ApiResponse<ScheduleItem>> => {

    try {

        // 쿠키 가져오기
        const cookieStore =
            await cookies();

        const accessToken =
            cookieStore
                .get('accessToken')
                ?.value;


        // 토큰 없음
        if (!accessToken) {

            return createCalendarActionErrorResponse(
                401,
                'UNAUTHORIZED',
                '로그인이 필요합니다.'
            );
        }


        // calendarId 검증
        if (!calendarId) {

            return createCalendarActionErrorResponse(
                400,
                'INVALID_CALENDAR_ID',
                '잘못된 요청입니다.'
            );
        }


        // 서비스 호출
        const result =
            await checkTodoService({
                calendarId,

                accessToken,

                isCompleted,
            });


        return result;

    } catch (error) {

        return createCalendarActionErrorResponse(
            500,
            'CALENDAR_TODO_CHECK_FAILED',
            error instanceof Error
                ? error.message
                : '알 수 없는 오류가 발생했습니다.'
        );
    }
};

