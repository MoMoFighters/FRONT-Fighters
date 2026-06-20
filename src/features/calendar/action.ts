'use server';

import { cookies } from 'next/headers';

import type { ApiResponse } from '@/lib/api';
import { addDateMemoService, addDateRangeMemoService, checkTodoService, createTodoService, deleteTodoService, editTodoService, getTodoList }
    from '@/app/services/phone/calendar/service';

import { GetCalendarSchedulesActionProps, ScheduleItem }
    from './type';





export const getCalendarSchedulesAction = async ({
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


        // 서비스 호출
        const result =
            await getTodoList({
                date,
                accessToken,
            });


        const calendarData =
            result.data;


        // 데이터 없음
        if (!calendarData) {
            return [];
        }


        return [

            ...calendarData.todos.map(
                (todo) => ({

                    calendarId: todo.calendarId,
                    title: todo.title,
                    category: "TODO" as const,
                    start: todo.start,
                    isCompleted: todo.isCompleted
                })
            ),

            ...calendarData.memos.map(
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
            '캘린더 일정 조회 실패:',
            error
        );

        return [];
    }
};




import { revalidatePath }
    from 'next/cache';

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


        // 캐시 갱신
        revalidatePath('/phone/calendar');


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


        // 캐시 갱신
        revalidatePath('/phone/calendar');


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


        // 캐시 갱신
        revalidatePath('/phone/calendar');


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
        revalidatePath('/calendar');


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


        // 캐시 갱신
        revalidatePath('/calendar');


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


        // 캐시 갱신
        revalidatePath('/calendar');


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

