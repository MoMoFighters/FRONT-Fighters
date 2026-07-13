import { Category } from "@/features/lecture/type";
import { PendingTeacherDetail, PendingTeacherListRequest, PendingTeacherListResponse, userDetail, UserList, UserListRequest, UserListResponse } from "@/features/user/type";
import { ApiResponse, fetchWithAuth } from "@/lib/api";
import { notFound } from "next/navigation";

const BASE_SERVER_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * 에러핸들링을 진행하는 공통 함수
 * @param response
 * @returns X -> 에러를 던짐
 */
const handleErrorResponse = async (
   response: Response,
   options: { notFoundOn404?: boolean } = { notFoundOn404: true }
) => {
   if (response.status === 404 && options.notFoundOn404) {
      notFound();
   }

   if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
         `${errorData.status}|${errorData.message}`
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
         point: number;
         doNotDisturb?: boolean;
         membership?: string;
         membershipStart?: string | null;
         nickname: string | null;
         isTempPwd: boolean;
         createdAt: string;
         points?: number;
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
   itemName?: string | null;
   accessToken: string;
   nickname?: string | null;
   currentPassword?: string | null;
   password?: string | null;
}

export const editMyInfoService = async ({
   accessToken,
   itemName,
   nickname,
   currentPassword,
   password,
}: EditMyInfoRequest): Promise<EditMyInfoResponse> => {
   const payload: {
      itemName?: string;
      nickname?: string;
      currentPassword?: string;
      password?: string;
   } = {};

   if (typeof itemName === "string" && itemName.trim()) {
      payload.itemName = itemName.trim();
   }

   if (typeof nickname === "string" && nickname.trim()) {
      payload.nickname = nickname.trim();
   }

   if (
      typeof currentPassword === "string" &&
      currentPassword.trim()
   ) {
      payload.currentPassword = currentPassword.trim();
   }

   if (typeof password === "string" && password.trim()) {
      payload.password = password.trim();
   }

   const response = await fetch(`${BASE_SERVER_URL}/api/v1/user/update`, {
      method: 'PATCH',
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
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

// ==========================================
// 관리자 회원 관리
// ==========================================

/**
 * 회원 전체 조회 api
 * @param payload 필터, 검색, 페이지네이션
 * @returns UserListResponse
 */
export const getUsers = async (
   payload: UserListRequest
): Promise<UserListResponse> => {

   const queryString =
      new URLSearchParams(
         Object.entries(payload)
            .filter(
               ([, value]) =>
                  value !== undefined
            )
            .map(([key, value]) => [
               key,
               String(value)
            ])
      ).toString();

   const response = await fetchWithAuth(`/api/v1/user/list?${queryString}`, {
      cache: "no-store",
   });
   await handleErrorResponse(response);
   const result: ApiResponse<Omit<UserListResponse, "users"> & {
      users: Array<Omit<UserList, "userId"> & { id: number }>;
   }> = await response.json();
   const data = assertApiData(result);

   return {
      ...data,
      users: data.users.map(({ id, ...user }) => ({
         ...user,
         userId: id,
      })),
   };
}

/**
 * 유저 상세 조회 api
 * @param id 상세 조회할 유저의 id
 * @returns userDetail
 */
export const getUserById = async (id: string): Promise<userDetail> => {

   const response = await fetchWithAuth(`/api/v1/user/list/detail/${id}`, {
      cache: "no-store",
   });
   await handleErrorResponse(response);
   const result: ApiResponse<userDetail> = await response.json();
   return assertApiData(result);
}

/**
 * 승인 대기 강사 전체 조회 api
 * @param payload 검색, 페이지네이션
 * @returns PendingTeacherListResponse
 */
export const getPendingTeachers = async (
   payload: PendingTeacherListRequest
): Promise<PendingTeacherListResponse> => {

   const queryString =
      new URLSearchParams(
         Object.entries(payload)
            .filter(
               ([, value]) =>
                  value !== undefined
            )
            .map(([key, value]) => [
               key,
               String(value)
            ])
      ).toString();

   const response = await fetchWithAuth(`/api/v1/teacher-applications?${queryString}`, {
      cache: "no-store",
   });
   await handleErrorResponse(response);
   const result: ApiResponse<PendingTeacherListResponse> = await response.json();
   return assertApiData(result);
}

/**
 * 승인 대기 강사 상세 조회 api
 * @param id 상세 조회할 강사의 id
 * @returns PendingTeacherDetail
 */
export const getPendingTeacherById = async (id: string): Promise<PendingTeacherDetail> => {

   const response = await fetchWithAuth(`/api/v1/teacher-application-detail/${id}`, {
      cache: "no-store",
   });
   await handleErrorResponse(response);
   const result: ApiResponse<PendingTeacherDetail> = await response.json();
   return assertApiData(result);
}

/**
 * 강사 개별 및 일괄 승인 api
 * @param ids 승인할 강사의 id 들
 * @returns
 */
export const approvePendingTeacher = async (ids: string[]) => {
   const response = await fetchWithAuth('/api/v1/application-approve', {
      method: "PATCH",
      body: JSON.stringify({
         userId: ids.map(Number),
      })
   });

   await handleErrorResponse(response, { notFoundOn404: false });
   return response.json();
}

/**
 * 강사 승인 거절 api
 * @param id 승인 거절할 강사의 id
 * @param reason 거절 사유
 * @returns
 */
export const rejectPendingTeacher = async (id: string, reason: { reason: string }) => {
   const response = await fetchWithAuth(`/api/v1/application-reject/${id}`, {
      method: "PATCH",
      body: JSON.stringify(reason)
   });

   await handleErrorResponse(response, { notFoundOn404: false });
   return response.json();
}

/**
 * 유저 제재 횟수 늘리는 api
 * @param id 제재 횟수 늘릴 유저의 id
 * @returns
 */
export const plusReportCount = async (id: string) => {
   const response = await fetchWithAuth(`/api/v1/user/plus/report-count/${id}`, {
      method: "PATCH",
   });

   await handleErrorResponse(response, { notFoundOn404: false });
   return response.json();
}

/**
 * 유저 제재 횟수 늘리는 api
 * @param id 제재 횟수 줄일 유저의 id
 * @returns
 */
export const minusReportCount = async (id: string) => {
   const response = await fetchWithAuth(`/api/v1/user/minus/report-count/${id}`, {
      method: "PATCH",
   });

   await handleErrorResponse(response, { notFoundOn404: false });
   return response.json();
}
