'use server';

import { cookies } from 'next/headers';

import { checkTodoService, deleteTodoService, editTodoService, getTodoList }
    from '@/app/services/phone/todo/service';

import { CreateTodoActionState, GetCalendarSchedulesActionProps, ScheduleItem }
    from './todoType';





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

        console.log(calendarData, '??')

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

import {
    createTodoService,
} from '@/app/services/phone/todo/service';





export const createTodoAction = async (
    prevState: CreateTodoActionState,
    formData: FormData
): Promise<CreateTodoActionState> => {

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

            return {
                success: false,
                message:
                    '로그인이 필요합니다.',
            };
        }


        // form data
        const title = formData.get('title') as string;
        const start = formData.get('start') as string;


        // todo 생성
        const result =
            await createTodoService({
                title,
                start,
                accessToken,
            });


        // 캐시 갱신
        revalidatePath('/phone/calendar');


        return {
            success: true,

            message:
                result.message,
        };

    } catch (error) {

        return {
            success: false,

            message:
                error instanceof Error
                    ? error.message
                    : 'Todo 등록에 실패하였습니다.',
        };
    }
};


export const deleteTodoAction = async (
    calendarId: number
) => {

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

            return {
                success: false,
                message:
                    '로그인이 필요합니다.',
            };
        }


        // calendarId 검증
        if (!calendarId) {

            return {
                success: false,
                message:
                    '잘못된 요청입니다.',
            };
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


        // 성공 반환
        return {
            success: true,
            message:
                result.message,
        };

    } catch (error) {

        // 에러 객체
        if (error instanceof Error) {

            return {
                success: false,
                message:
                    error.message,
            };
        }


        // 알 수 없는 에러
        return {
            success: false,
            message:
                '알 수 없는 오류가 발생했습니다.',
        };
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
}: EditTodoActionRequest) => {

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

            return {
                success: false,
                message:
                    '로그인이 필요합니다.',
            };
        }


        // calendarId 검증
        if (!calendarId) {

            return {
                success: false,
                message:
                    '잘못된 요청입니다.',
            };
        }


        // 제목 검증
        if (!title.trim()) {

            return {
                success: false,
                message:
                    'Todo 제목을 입력해주세요.',
            };
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


        // 성공 반환
        return {
            success: true,
            message:
                result.message,
        };

    } catch (error) {

        // Error 객체
        if (error instanceof Error) {

            return {
                success: false,
                message:
                    error.message,
            };
        }


        // 알 수 없는 에러
        return {
            success: false,
            message:
                '알 수 없는 오류가 발생했습니다.',
        };
    }
};



export interface CheckTodoActionRequest {
    calendarId: number;
    isCompleted: boolean;
}


export const checkTodoAction = async ({
    calendarId,
    isCompleted,
}: CheckTodoActionRequest) => {

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

            return {
                success: false,
                message:
                    '로그인이 필요합니다.',
            };
        }


        // calendarId 검증
        if (!calendarId) {

            return {
                success: false,
                message:
                    '잘못된 요청입니다.',
            };
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


        // 성공 반환
        return {
            success: true,
            message:
                result.message,

            data:
                result.data,
        };

    } catch (error) {

        // Error 객체
        if (error instanceof Error) {

            return {
                success: false,
                message:
                    error.message,
            };
        }


        // 알 수 없는 에러
        return {
            success: false,
            message:
                '알 수 없는 오류가 발생했습니다.',
        };
    }
};