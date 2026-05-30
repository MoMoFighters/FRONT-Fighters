// 강의 관련 (공동)

import { GetLecturesRequest, LectureDetail, LectureListInfo, LectureResponse, LecturesApiResponse, StatusApiUrl, StatusRequest } from "@/features/lecture/type";
import { fetchWithAuth } from "@/lib/api"


// 강의 목록 전체 조회 (토큰을 넘겨서 role 비교, 그 외 각 도메인 별 필요한 값은 쿼리 파라미터로)

export const getLectures = async (payload: GetLecturesRequest): Promise<LectureListInfo> => {

  const queryString =
    new URLSearchParams(
      Object.entries(payload)
        .filter(([_, value]) =>
          value !== undefined
        )
        .map(([key, value]) => [
          key,
          String(value)
        ])
    ).toString();

  console.log('????', `/api/v1/lectures?${queryString}`);

  const response = await fetchWithAuth(`/api/v1/lectures?${queryString}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '강의 정보를 불러오는데 실패하였습니다.');
  }

  const result: LecturesApiResponse = await response.json();
  console.log(result);

  return {
    content: result.data.content.map((lecture) => ({
      id: lecture.lectureId,
      title: lecture.title,
      description: lecture.description,
      thumbnailUrl: lecture.thumbnailUrl,
      category: lecture.category,
      lectureStatus: lecture.lectureStatus,
      averageRating: lecture.averageRating,
    })),

    page: result.data.page,
    size: result.data.size,
    totalElements: result.data.totalElements,
    totalPages: result.data.totalPages,
  };
}

// 강의 상세 조회

export const getLectureById = async (id: string): Promise<LectureDetail> => {
  const response = await fetchWithAuth(`/api/v1/lectures/${id}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '강의 정보를 불러오는데 실패하였습니다.');
  }
  const result = await response.json();
  console.log(result);
  return {
    id: result.data.lectureId,
    title: result.data.title,
    description: result.data.description,
    thumbnailUrl: result.data.thumbnailUrl,
    category: result.data.category,
    lectureStatus: result.data.lectureStatus,
    averageRating: result.data.averageRating,
    chapters: result.data.chapters
  }
}

// 강의 상태 업데이트

export const updateLectureStatus = async (id: string, payload: StatusRequest) => {
  const response = await fetchWithAuth(`/api/v1/lectures/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
  console.log(response);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || '게시글 삭제에 실패하였습니다.');
  }

  return response.json();
}

/*
- 강의 상세 조회(parameter로 아이디 넘기기)

- 챕터 상세 조회(동영상)

- 강의별 리뷰 목록 조회
*/


// 강의 관련 (관리자)
/*
1. 강의 목록 전체 조회(페이지네이션 기반)
2. 강의 영구 삭제(hard delete)
*/


// 강의 관련 (학생)
/*
- 강의 전체 목록 조회(내가 신청한 것 제외, enrolled===false)
- 내 강의 목록 조회(enrolled===true)
- 특정 카테고리 강의 전체 목록 조회(내가 신청한 것 제외 enrolled===false)
- 특정 카테고리의 내 강의 목록 조회(enrolled===true)

- 수강 신청
- 챕터 상세 조회 시 진척도 불러오기(learningHistory)
*/

// 강의 관련(강사)

/*
- 내 강의 목록 조회
- 강의 등록
- 강의 수정
- 강의 삭제(soft-delete)?
*/