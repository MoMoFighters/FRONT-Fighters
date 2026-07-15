import {
  EnrollLectureResponse,
  LectureListRequest,
  LectureDetailResponse,
  LectureListResponse,
  LectureMetaResponse,
  UpdateVideoProgressByExitRequest,
  UpdateVideoProgressRequest,
  UpdateVideoProgressResponse,
  LectureStatus,
  VideoPlayerResponse,
  ReviewResponse,
  CreateReviewRequest,
  Category,
  AsideCardInfoResponse,
  LatestChapterInfoResponse,
  UpdateLectureRequest,
  UpdateLectureResponse,
  DeleteLectureResponse,
  UpdateChapterRequest,
} from "@/features/lecture/type";
import { ApiResponse, fetchWithAuth } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * 에러핸들링을 진행하는 공통 함수
 * @param response
 * @returns X -> 에러를 던짐
 */
const handleErrorResponse = async (
  response: Response,
  options: { notFoundOn404?: boolean } = { notFoundOn404: true },
) => {
  if (response.status === 404 && options.notFoundOn404) {
    notFound();
  }

  if (!response.ok) {
    const errorText = await response.text();
    let message = response.statusText || "요청 처리에 실패했습니다.";

    if (errorText) {
      try {
        const errorData = JSON.parse(errorText) as { message?: string };
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

const parseJsonOrNull = async <T>(response: Response): Promise<T | null> => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  return JSON.parse(text) as T;
};



/**
 * 헤더에 토큰을 넘기지 않는 강의 전체 조회 api -> 조건에 맞는 모든 강의를 조회하기 위함 (SSG 렌더링 방식)
 * @param payload -> 쿼리 파라미터에 필요한 값들 (필터, 페이지네이션 등등)
 * @returns LectureListResponse
 */
export const getLectures = async (
  payload: LectureListRequest
): Promise<LectureListResponse> => {
  const queryString =
    new URLSearchParams(
      Object.entries(payload)
        .filter(([, value]) => value !== undefined && value !== "")
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => [
          key,
          String(value),
        ])
    ).toString();

  const response = await fetch(`${BASE_URL}/api/v1/lectures?${queryString}`, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "force-cache",
    next: {
      tags: ["lectures"],
    },
  });
  await handleErrorResponse(response);
  const result: ApiResponse<LectureListResponse> = await response.json();
  return assertApiData(result);
};

/**
 * 헤더에 토큰을 넘기는 강의 전체 조회 api -> user의 role, id 에 따라 다른 데이터 값을 기대하는 경우를 위함
 * @param payload 쿼리 파라미터에 필요한 값들 (필터, 페이지네이션 등등)
 * @returns LectureListResponse
 */
export const getLecturesWithAuth = async (
  payload: LectureListRequest
): Promise<LectureListResponse> => {
  const queryString =
    new URLSearchParams(
      Object.entries(payload)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [
          key,
          String(value),
        ])
    ).toString();

  const response = await fetchWithAuth(`/api/v1/lectures?${queryString}`, {
    next: { revalidate: 60 },
  });
  await handleErrorResponse(response);
  const result: ApiResponse<LectureListResponse> = await response.json();
  return assertApiData(result);
};

/**
 * 강의 상세 조회 api -> user의 role, id 에 따라 필요한 데이터 값이 전부 다르므로 헤더에 토큰을 담아서 요청
 * @param id 조회를 원하는 강의의 id
 * @returns LectureDetailResponse
 */
export const getLectureById = async (id: string): Promise<LectureDetailResponse> => {
  const response = await fetchWithAuth(`/api/v1/lectures/${id}`, {
    next: { revalidate: 60 },
  });

  if (response.status === 401) {
    redirect('/auth/login');
  }
  await handleErrorResponse(response);
  const result: ApiResponse<LectureDetailResponse> = await response.json();
  return assertApiData(result);
};

/**
 * 비로그인 강의 상세 조회 api -> 헤더에 토큰 X
 * @param id 조회를 원하는 강의의 id
 * @returns LectureDetailResponse
 */
export const getLectureByIdForGuest = async (id: string): Promise<LectureDetailResponse> => {
  const response = await fetch(`${BASE_URL}/api/v1/lectures/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "force-cache",
    next: {
      tags: ["lectures"],
    },
  });
  await handleErrorResponse(response);
  const result: ApiResponse<LectureDetailResponse> = await response.json();
  return assertApiData(result);
};

/**
 * 수강평 목록 조회 api -> 강의 상세 조회 페이지 내에서 수강평을 클릭했을 때 즉, tab === "reviews" 일 때 요청
 * @param id 수강평 목록을 불러올 강의의 id
 * @param page 페이지네이션
 * @returns ReviewResponse
 */
export const getReviewsByLectureId = async (id: string, page: number) => {
  const params = new URLSearchParams();
  params.set("page", String(page));

  const response = await fetchWithAuth(`/api/v1/lectures/${id}/reviews?${params.toString()}`, {
    next: { revalidate: 60 },
  });
  await handleErrorResponse(response);
  const result: ApiResponse<ReviewResponse> = await response.json();
  return assertApiData(result);
};

/**
 * 수강평 등록 api
 * @param id 어떤 강의에 수강평을 등록하는 지에 대한 강의 id
 * @param payload 별점과 수강평 내용
 * @returns 
 */
export const createReviewByLectureId = async (
  id: string,
  payload: CreateReviewRequest
) => {
  const response = await fetchWithAuth(`/api/v1/lectures/${id}/reviews`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  await handleErrorResponse(response);
  return response.json();
};

/**
 * 강의 조회 페이지들 중 우측 사이드 카드에 담을 진척도 정보 조회 api
 * @param category 카테고리별 진척도 조회 시 필요한 카테고리
 * @returns AsideCardInfoResponse
 */
export const getProgressByCategory = async (category?: Category): Promise<AsideCardInfoResponse> => {
  const params = new URLSearchParams();
  if (category) {
    params.set("category", String(category));
  }

  const queryString = params.toString();
  const response = await fetchWithAuth(`/api/v1/enrollments/progress${queryString ? `?${queryString}` : ""}`, {
    cache: "no-store",
  });
  await handleErrorResponse(response);
  const result: ApiResponse<AsideCardInfoResponse> = await response.json();
  return assertApiData(result);
}

/**
 * 강의 조회 페이지들 중 우측 사이드 카드에 담을 이어보기 정보 조회 api
 * @param category 카테고리별 이어보기 조회 시 필요한 카테고리
 * @returns LatestChapterInfoResponse
 */
export const getLatestChapterInfo = async (
  category?: Category
): Promise<LatestChapterInfoResponse | undefined> => {
  const params = new URLSearchParams();
  if (category) {
    params.set("category", String(category));
  }

  const queryString = params.toString();
  const response = await fetchWithAuth(`/api/v1/enrollments/continue-learning${queryString ? `?${queryString}` : ""}`, {
    cache: "no-store",
  });
  await handleErrorResponse(response);
  const result: ApiResponse<LatestChapterInfoResponse> = await response.json();

  return result.data && Object.keys(result.data).length > 0
    ? result.data
    : undefined;
}

/**
 * 선택한 강의의 상태를 변경하는 api
 * @param id 변경할 강의
 * @param status -> 변경할 상태
 * @returns 실패가 아닌 성공의 경우 리턴값이 딱히 필요하지 않음
 */
export const updateLectureStatus = async (
  id: string,
  status: LectureStatus
) => {
  const response = await fetchWithAuth(`/api/v1/lectures/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      lectureStatus: status,
    }),
  });

  await handleErrorResponse(response);

  return response.json();
};

/**
 * 챕터 상세 조회 페이지에서 강의 메타 데이터를 불러오는 조회 api
 * @param lectureId
 * @returns LectureMetaResponse
 */
export const getLectureMeta = async (
  lectureId: string
): Promise<LectureMetaResponse> => {
  const response = await fetchWithAuth(`/api/v1/lectures/${lectureId}/meta`, {
    next: { revalidate: 60 },
  });

  await handleErrorResponse(response);

  const result: ApiResponse<LectureMetaResponse> = await response.json();

  return assertApiData(result);
};

/**
 * 챕터 상세 조회에서 동영상 이어보기를 위한 동영상 url 및 마지막 시청위치를 불러오는 조회 api
 * @param lectureId
 * @param chapterId
 * @returns
 */
export const getVideoPlayer = async (
  lectureId: string,
  chapterId: string
): Promise<VideoPlayerResponse> => {
  const response = await fetchWithAuth(
    `/api/v1/lectures/${lectureId}/chapters/${chapterId}/stream`,
    { cache: "no-store" }
  );

  await handleErrorResponse(response);

  const result: ApiResponse<VideoPlayerResponse> = await response.json();

  return assertApiData(result);
};

/**
 * 챕터 영상의 진척도를 저장하는 api ==> 추후에 수정 필요할 수도 있음
 * @param lectureId
 * @param chapterId
 * @param payload
 * @returns
 */
export const updateVideoProgress = async (
  lectureId: string,
  chapterId: string,
  payload: UpdateVideoProgressRequest
): Promise<UpdateVideoProgressResponse> => {
  const response = await fetchWithAuth(
    `/api/v1/lectures/${lectureId}/chapters/${chapterId}/progress`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );

  await handleErrorResponse(response);

  const result: ApiResponse<UpdateVideoProgressResponse> =
    await response.json();

  return assertApiData(result);
};

/**
 * 나가기 버튼 눌렀을 때 한번 더 진척도를 저장하는 api ==> 추후에 수정 필요할 수도 있음
 * @param lectureId
 * @param chapterId
 * @param payload
 * @returns
 */
export const updateVideoProgressByExit = async (
  lectureId: string,
  chapterId: string,
  payload: UpdateVideoProgressByExitRequest
): Promise<UpdateVideoProgressResponse> => {
  const response = await fetchWithAuth(
    `/api/v1/lectures/${lectureId}/chapters/${chapterId}/exit`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );

  await handleErrorResponse(response);

  const result: ApiResponse<UpdateVideoProgressResponse> =
    await response.json();

  return assertApiData(result);
};

/**  ==> id 랑 position 같이 넘겨서 position은 쿼리 파라미터로 넘기기 해야됨
 * 수강 신청 api
 * @param id
 * @returns
 */
export const enrollLectureById = async (
  id: string,
  position?: string
): Promise<EnrollLectureResponse> => {
  const params = new URLSearchParams();
  if (position) {
    params.set("position", position);
  }

  const queryString = params.toString();
  const response = await fetchWithAuth(`/api/v1/lectures/${id}/enrollments${queryString ? `?${queryString}` : ""}`, {
    method: "POST",
  });

  await handleErrorResponse(response);

  return response.json();
};

/**
 * 강의 수정 api -> 제목, 설명만 수정 가능
 * @param id 수정할 강의 id
 * @param payload 수정할 제목, 설명
 * @returns UpdateLectureResponse
 */
export const updateLectureById = async (
  id: string,
  payload: UpdateLectureRequest
): Promise<UpdateLectureResponse | null> => {
  const response = await fetchWithAuth(`/api/v1/lectures/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  await handleErrorResponse(response);

  const result: ApiResponse<UpdateLectureResponse> = await response.json();

  return result.data ?? null;
};

/**
 * 강의 삭제 api
 * @param id 삭제할 강의 id
 * @returns
 */
export const deleteLectureById = async (id: string) => {
  const response = await fetchWithAuth(`/api/v1/lectures/${id}`, {
    method: "DELETE",
  });

  await handleErrorResponse(response, { notFoundOn404: false });

  return parseJsonOrNull<ApiResponse<DeleteLectureResponse>>(response);
};

/**
 * 챕터 수정 api -> 제목만 수정 가능하지만, orderNo도 함께 전달
 * @param lectureId 수정할 챕터가 속한 강의 id
 * @param chapterId 수정할 챕터 id
 * @param payload 수정할 제목, 기존 orderNo
 * @returns
 */
export const updateChapterByIds = async (
  lectureId: string,
  chapterId: string,
  payload: UpdateChapterRequest
) => {
  const response = await fetchWithAuth(
    `/api/v1/lectures/${lectureId}/chapters/${chapterId}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );

  await handleErrorResponse(response);

  return response.json();
};

/**
 * 챕터 동영상 삭제 api -> 영상이 챕터의 필수 요소라 이 요청이 성공하면 챕터 자체가 함께 삭제된다.
 * 영상만 삭제하는 별도 api는 없으므로, 챕터 삭제는 이 api 하나로 처리한다.
 * @param lectureId 삭제할 챕터가 속한 강의 id
 * @param chapterId 삭제할 챕터 id
 * @returns
 */
export const deleteChapterVideoById = async (lectureId: string, chapterId: string) => {
  const response = await fetchWithAuth(`/api/v1/lectures/${lectureId}/chapters/${chapterId}/video`, {
    method: "DELETE",
  });

  await handleErrorResponse(response, { notFoundOn404: false });

  return parseJsonOrNull<ApiResponse<null>>(response);
};

/**
 * 수강평 삭제 api
 * @param id 삭제할 수강평 id
 * @returns 
 */
export const deleteReviewById = async (id: string) => {
  const response = await fetchWithAuth(`/api/v1/lectures/reviews/${id}`, {
    method: "DELETE",
  });

  await handleErrorResponse(response, { notFoundOn404: false });

  return parseJsonOrNull(response);
};

export const test = () => {
  revalidatePath('/lectures');
}