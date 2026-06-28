// 학생, 강사 - 마이페이지 기능

import { Category } from "@/features/lecture/type";
import { GetUsersRequest, GetUsersResponse, UpdateTeacherStatusRequest, UpdateTeacherStatusResponse } from "@/features/user/type";
import { ApiResponse, fetchWithAuth } from "@/lib/api";

/*
 - 내 상세 정보 조회
 - 내 정보 수정
*/

// 회원관련

/*
 - 회원목록 전체조회 (페이지네이션)
 - 학생 목록 전체 조회? (쿼리파라미터 넘기고, 페이지네이션)
 - 강사 목록 전체 조회? (쿼리파라미터 넘기고, 페이지네이션)
 - 탈퇴 회원 전체 조회? (쿼리파라미터 넘기고, 페이지네이션)

 - 강사 증빙자료 조회
                ㄴ> 유저 정보 불러올때 증빙자료 한번에 같이 넘어오는가? 확인하고, 위쪽으로 합칠수도 있음


 - 회원 상태 변경
    ㄴ> 영구정지, 일시정지, 승인, 미승인, 정지해제
 

 - 회원 영구 삭제 - m4 ????????????
 */
const BASE_SERVER_URL = process.env.NEXT_PUBLIC_API_BASE_URL;




// ==========================================
// [SY-12] 내 상세 정보 조회 관련 타입 및 서비스
// ==========================================
export interface BuildingInfo {
   category: Category;
   position: number;
   level: number;
}

export interface GetMyInfoResponse {
   timestamp: string;
   status: number;
   code: string;
   message: string;
   data: {
      userDetail: {
         profileImageUrl: string;
         email: string | null;
         name: string;
         nickname: string | null;
         isTempPwd: boolean;
         createdAt: string;
         points?: number;
         point?: number;
      },
      buildings: BuildingInfo[]
      points?: number;
      point?: number;
   };
}

export const getMyInfoService = async (accessToken: string): Promise<GetMyInfoResponse> => {
   const response = await fetch(`${BASE_SERVER_URL}/api/v1/user/detail`, {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${accessToken}`,
      },
   });

   const result: GetMyInfoResponse = await response.json();

   if (response.status !== 200) {
      throw new Error(result.message || '알 수 없는 에러');
   }
   return result;
};

// ==========================================
// [SY-13] 내 정보 수정 관련 타입 및 서비스
// ==========================================
export type EditMyInfoResponse = ApiResponse<{
   isPwdChanged: boolean;
}>

export interface EditMyInfoRequest {
   accessToken: string;
   nickname?: string;
   currentPassword?: string;
   password?: string;
}

export const editMyInfoService = async ({
   accessToken,
   nickname,
   currentPassword,
   password,
}: EditMyInfoRequest): Promise<EditMyInfoResponse> => {
   const response = await fetch(`${BASE_SERVER_URL}/api/v1/user/update`, {
      method: 'PATCH',
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
         nickname,
         currentPassword,
         password,
      }),
   });

   const result: EditMyInfoResponse = await response.json();

   return result;
};

// ==========================================
// [SY-14] 닉네임 중복 확인 / 등록 관련 타입 및 서비스
// ==========================================
export interface NicknameCheckResponse {
   timestamp: string;
   status: number;
   code: string;
   message: string;
   data: null;
}

export const nicknameCheckService = async (
   accessToken: string,
   nickname: string
) => {
   const response = await fetch(`${BASE_SERVER_URL}/api/v1/user/nickname/check`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ nickname }),
   });

   if (!response.ok) {
      return response.json();
   }

   const result = await response.json();
   return result;
};

// 관리자 - 회원 전체 조회

export const getUsers = async (
   payload: GetUsersRequest
): Promise<GetUsersResponse> => {

   const queryString =
      new URLSearchParams(
         Object.entries(payload)
            .filter(
               ([_, value]) =>
                  value !== undefined
            )
            .map(([key, value]) => [
               key,
               String(value)
            ])
      ).toString();

   const response = await fetchWithAuth(`/api/v1/user/list?${queryString}`);

   if (!response.ok) {

      const errorData =
         await response.json();

      throw new Error(
         `${errorData.status}|${errorData.message}`
      );
   }

   const result =
      await response.json();


   return result.data;
}

// 관리자 - 강사 승인

export const updateTeacherStatus = async (userId: string, payload: UpdateTeacherStatusRequest): Promise<UpdateTeacherStatusResponse> => {
   const response = await fetchWithAuth(`/api/v1/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
   });

   if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
         `${errorData.status}|${errorData.message}`
      );
   }

   const result = await response.json();
   return result.data;
}
