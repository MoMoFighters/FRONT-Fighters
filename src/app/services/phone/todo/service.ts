// Todo 관련

import { CreateTodoProps, CreateTodoResponse, GetTodoListRequest, GetTodoListResponse } from "@/features/phone/type";

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

        // 401
        if (response.status === 401) {

            const result:
                GetTodoListResponse =
                await response.json();

            throw new Error(
                result.message ||
                '다시 로그인 해주세요.'
            );
        }

        // 기타 에러
        if (!response.ok) {

            const result:
                GetTodoListResponse =
                await response.json();

            throw new Error(
                result.message ||
                '월별 캘린더 조회에 실패했습니다.'
            );
        }

        // 성공
        const result:
            GetTodoListResponse =
            await response.json();

        return result;

    } catch (error) {

        if (error instanceof Error) {
            throw error;
        }

        throw new Error(
            '알 수 없는 오류가 발생했습니다.'
        );
    }
};


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