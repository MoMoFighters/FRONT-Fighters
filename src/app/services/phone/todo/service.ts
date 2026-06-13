// Todo 관련

import { CheckTodoRequest, CheckTodoResponse, CreateTodoProps, CreateTodoResponse, DeleteTodoRequest, DeleteTodoResponse, EditTodoRequest, EditTodoResponse, GetTodoListRequest, GetTodoListResponse, ScheduleItem } from "@/features/todo/type";

/*
 - Todo 목록 월별 조회(byUserId)
 
 - Todo 추가하기
 - Todo 제거하기

//  PATCH -> 합칠수도?
 - Todo 수정하기 string
 - Todo 완료 상태 변경하기 boolean
*/




const BASE_SERVER_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL;



export const getTodoList = async ({
    date,
    accessToken,
}: GetTodoListRequest): Promise<GetTodoListResponse> => {

    try {

        const response = await fetch(
            `${BASE_SERVER_URL}/api/v1/calendar/monthly?month=${date}`,
            {
                method: 'GET',

                headers: {
                    Authorization:
                        `Bearer ${accessToken}`,
                },
            }
        );


        const result:
            GetTodoListResponse =
            await response.json();


        // 성공
        if (response.ok) {

            return result;
        }


        // 400
        if (response.status === 400) {

            throw new Error(
                result.message ||
                '날짜는 필수 항목입니다.'
            );
        }


        // 401
        if (response.status === 401) {

            throw new Error(
                result.message ||
                'Authentication required.'
            );
        }


        throw new Error(
            result.message ||
            '월별 캘린더 조회에 실패했습니다.'
        );

    } catch (error) {

        console.error(error);

        if (error instanceof Error) {

            throw error;
        }

        throw new Error(
            '알 수 없는 오류가 발생했습니다.'
        );
    }
};

// Todo 추가하기
export const createTodoService = async ({
    title,
    start,
    accessToken,
}: CreateTodoProps)
    : Promise<CreateTodoResponse> => {

    try {

        const response = await fetch(
            `${BASE_SERVER_URL}/api/v1/calendar/todo`,
            {
                method: 'POST',

                headers: {
                    'Content-Type':
                        'application/json',

                    Authorization:
                        `Bearer ${accessToken}`,
                },

                body: JSON.stringify({
                    title,
                    start,
                }),
            }
        );


        const result:
            CreateTodoResponse =
            await response.json();


        // 성공
        if (
            response.ok &&
            result.status === 201
        ) {

            return result;
        }


        // validation error
        if (response.status === 400) {

            throw new Error(
                result.message ||
                '제목은 필수 항목입니다.'
            );
        }


        // unauthorized
        if (response.status === 401) {

            throw new Error(
                result.message ||
                '로그인이 필요합니다.'
            );
        }


        throw new Error(
            result.message ||
            'Todo 등록에 실패하였습니다.'
        );

    } catch (error) {

        if (error instanceof Error) {
            throw error;
        }

        throw new Error(
            '알수없는 오류가 발생했습니다.'
        );
    }
};





// Todo 삭제하기
export const deleteTodoService = async ({
    calendarId,
    accessToken
}: DeleteTodoRequest): Promise<DeleteTodoResponse> => {
    try {
        const response = await fetch(
            `${BASE_SERVER_URL}/api/v1/calendar/todo/${calendarId}`,
            {
                method: 'DELETE',

                headers: {
                    Authorization:
                        `Bearer ${accessToken}`,
                }
            }
        );


        const result =
            response.status !== 204
                ? await response.json()
                : null;


        // 성공
        if (response.ok) {
            return result;
        }


        if (response.status === 401) {

            throw new Error(
                result.message ||
                '로그인이 필요합니다.'
            );
        }


        if (response.status === 403) {

            throw new Error(
                result.message ||
                '본인의 Todo 만 삭제할 수 있습니다.'
            );
        }
        if (response.status === 404) {

            throw new Error(
                result.message ||
                '해당 Todo 를 찾을 수 없습니다.'
            );
        }


        throw new Error(
            result.message ||
            'Todo 삭제에 실패하였습니다.'
        );

    } catch (error) {

        if (error instanceof Error) {
            throw error;
        }

        throw new Error(
            '알수없는 오류가 발생했습니다.'
        );
    }

}




// Todo 수정하기
export const editTodoService = async ({
    calendarId,
    accessToken,
    title,
    start
}: EditTodoRequest): Promise<EditTodoResponse> => {
    try {
        const response = await fetch(
            `${BASE_SERVER_URL}/api/v1/calendar/todo/${calendarId}`,
            {
                method: 'PATCH',

                headers: {
                    Authorization:
                        `Bearer ${accessToken}`,

                    'Content-Type':
                        'application/json',
                },
                body:
                    JSON.stringify({ title, start })

            }
        );


        const result:
            EditTodoResponse =
            await response.json();



        // 성공
        if (response.ok) {
            return result;
        }


        if (response.status === 401) {

            throw new Error(
                result.message ||
                '로그인이 필요합니다.'
            );
        }


        if (response.status === 403) {

            throw new Error(
                result.message ||
                '본인의 Todo 만 수정할 수 있습니다.'
            );
        }
        if (response.status === 404) {

            throw new Error(
                result.message ||
                '해당 Todo 를 찾을 수 없습니다.'
            );
        }


        throw new Error(
            result.message ||
            'Todo 수정에 실패하였습니다.'
        );

    } catch (error) {

        if (error instanceof Error) {
            throw error;
        }

        throw new Error(
            '알수없는 오류가 발생했습니다.'
        );
    }
}

export const checkTodoService = async ({
    calendarId,
    accessToken,
    isCompleted,
}: CheckTodoRequest): Promise<CheckTodoResponse> => {

    try {

        const response = await fetch(
            `${BASE_SERVER_URL}/api/v1/calendar/todo/${calendarId}/check`,
            {
                method: 'PATCH',

                headers: {
                    Authorization:
                        `Bearer ${accessToken}`,

                    'Content-Type':
                        'application/json',
                },

                body:
                    JSON.stringify({
                        isCompleted,
                    }),
            }
        );


        const result:
            CheckTodoResponse =
            await response.json();


        // 성공
        if (response.ok) {

            return result;
        }


        // 400
        if (response.status === 400) {

            throw new Error(
                result.message ||
                '체크 상태를 변경할 수 없습니다.'
            );
        }


        // 401
        if (response.status === 401) {

            throw new Error(
                result.message ||
                '로그인이 필요합니다.'
            );
        }


        // 403
        if (response.status === 403) {

            throw new Error(
                result.message ||
                '본인의 Todo만 변경할 수 있습니다.'
            );
        }


        // 404
        if (response.status === 404) {

            throw new Error(
                result.message ||
                'Todo를 찾을 수 없습니다.'
            );
        }


        throw new Error(
            result.message ||
            'Todo 체크 상태 변경에 실패했습니다.'
        );

    } catch (error) {

        if (error instanceof Error) {

            throw error;
        }

        throw new Error(
            '알 수 없는 오류가 발생했습니다.'
        );
    }
};