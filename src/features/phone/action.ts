'use server';

import { cookies } from 'next/headers';

import { getTodoList }
    from '@/app/services/phone/todo/service';

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

        console.log(calendarData, '??')

        // 데이터 없음
        if (!calendarData) {
            return [];
        }


        return [

            ...calendarData.todos.map(
                (todo) => ({

                    calendarId: todo.calendarId,

                    userId: 1,

                    start: todo.start,

                    end: null,

                    title: todo.title,

                    category: 'todo' as const,

                    isCompleted:
                        todo.isCompleted,

                    createdAt:
                        todo.start,
                })
            ),

            ...calendarData.memos.map(
                (memo) => ({

                    id: memo.calendarId,

                    userId: 1,

                    start: memo.start,

                    end: memo.end,

                    title: memo.title,

                    category: 'memo' as const,

                    isCompleted: false,

                    createdAt:
                        memo.start,
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


export interface CreateTodoActionState {
    success: boolean;

    message: string;
}


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