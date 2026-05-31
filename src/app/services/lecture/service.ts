// 강의 관련 (공동)

import { ChapterProgress, EnrollLectureResponse, GetLecturesRequest, LectureDetail, LectureListInfo, LectureMetaResponse, LectureProgress, LecturesApiResponse, ResumeResponse, StatusRequest, UpdateVideoProgressByExitRequest, UpdateVideoProgressRequest, UpdateVideoProgressResponse } from "@/features/lecture/type";
import { fetchWithAuth } from "@/lib/api"
import { notFound } from "next/navigation";


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

  const response = await fetchWithAuth(`/api/v1/lectures?${queryString}`, {
    cache: 'no-store'
  });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      `${errorData.status}|${errorData.message}`
    );
  }

  const result: LecturesApiResponse = await response.json();
  console.log('강의 전체 조회 확인용', result);

  return {
    content: result.data.content.map((lecture) => ({
      id: lecture.lectureId,
      title: lecture.title,
      description: lecture.description,
      thumbnailUrl: lecture.thumbnailUrl,
      category: lecture.category,
      lectureStatus: lecture.lectureStatus,
      averageRating: lecture.averageRating,
      isEnrolled: lecture.isEnrolled,
    })),

    page: result.data.page,
    size: result.data.size,
    totalElements: result.data.totalElements,
    totalPages: result.data.totalPages,
  };
}

// 강의 상세 조회

export const getLectureById = async (id: string): Promise<LectureDetail> => {
  const response = await fetchWithAuth(`/api/v1/lectures/${id}`, {
    cache: 'no-store'
  });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      `${errorData.status}|${errorData.message}`
    );
  }

  const result = await response.json();
  console.log('강의 상세 조회 확인용', result);

  return {
    id: result.data.lectureId,
    title: result.data.title,
    description: result.data.description,
    thumbnailUrl: result.data.thumbnailUrl,
    category: result.data.category,
    lectureStatus: result.data.lectureStatus,
    averageRating: result.data.averageRating,
    chapters: result.data.chapters,
    isEnrolled: result.data.isEnrolled,
  }
}

// 강의 상태 업데이트

export const updateLectureStatus = async (id: string, payload: StatusRequest) => {
  const response = await fetchWithAuth(`/api/v1/lectures/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    cache: 'no-store'
  });
  console.log('강의 상태 변경 확인용', response);

  if (!response.ok) {
    const errorData = await response.json();


    throw new Error(
      `${errorData.status}|${errorData.message}`
    );
  }

  return response.json();
}

// 강의별 진척도 조회

export const getLectureProgress = async (id: string): Promise<LectureProgress> => {
  const response = await fetchWithAuth(`/api/v1/lectures/${id}/progress`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorData = await response.json();


    throw new Error(
      `${errorData.status}|${errorData.message}`
    );
  }

  const result = await response.json();
  console.log('강의별 진척도 확인용', result);

  return {
    totalProgress: result.data.totalProgress,
    completedCount: result.data.completedCount,
    totalChapterCount: result.data.totalChapterCount
  }

}

// 챕터별 진척도 조회

export const getChaptersById = async (lectureId: string): Promise<ChapterProgress[]> => {
  const response = await fetchWithAuth(`/api/v1/lectures/${lectureId}/chapters/progress`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorData = await response.json();


    throw new Error(
      `${errorData.status}|${errorData.message}`
    );
  }

  const result = await response.json();
  console.log('챕터별 진척도 확인용', result);

  return result.data.chapters;

}

// 영상 시청 중 10초 마다 시청 시점 업데이트

export const updateVideoProgress = async (lectureId: string, chapterId: string, payload: UpdateVideoProgressRequest): Promise<UpdateVideoProgressResponse> => {
  const response = await fetchWithAuth(`/api/v1/lectures/${lectureId}/chapters/${chapterId}/progress`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    cache: 'no-store'
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

// 영상 시청 중 나가기 버튼을 눌렀을 경우 시청 시점 업데이트

export const updateVideoProgressByExit = async (lectureId: string, chapterId: string, payload: UpdateVideoProgressByExitRequest): Promise<UpdateVideoProgressResponse> => {
  const response = await fetchWithAuth(`/api/v1/lectures/${lectureId}/chapters/${chapterId}/exit`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    cache: 'no-store'
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

// 영상 이어보기

export const getResumeInfo = async (
  lectureId: string,
  chapterId: string
): Promise<ResumeResponse> => {

  const response = await fetchWithAuth(`/api/v1/lectures/${lectureId}/chapters/${chapterId}/resume`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorData = await response.json();


    throw new Error(
      `${errorData.status}|${errorData.message}`
    );
  }

  const result = await response.json();
  console.log('이어보기', result);

  return result.data;
}

// 강의 메타데이터 조회

export const getLectureMeta = async (lectureId: string): Promise<LectureMetaResponse> => {
  const response = await fetchWithAuth(`/api/v1/lectures/${lectureId}/meta`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorData = await response.json();


    throw new Error(
      `${errorData.status}|${errorData.message}`
    );
  }

  const result = await response.json();
  console.log('메타데이터', result);

  return result.data;

}

// 강의 영상 재생

export const getChapterVideo = async (lectureId: string, chapterId: string): Promise<string> => {
  const response = await fetchWithAuth(`/api/v1/lectures/${lectureId}/chapters/${chapterId}/stream`, {
    cache: 'no-store'
  })

  if (!response.ok) {
    const errorData = await response.json();


    throw new Error(
      `${errorData.status}|${errorData.message}`
    );
  }

  const result = await response.json();
  console.log('강의 동영상', result);

  return result.data.presignedUrl;
}

// 수강 신청

export const enrollLectureById = async (id: string): Promise<EnrollLectureResponse> => {
  const response = await fetchWithAuth(`/api/v1/lectures/${id}/enrollments`, {
    method: "POST",
    cache: 'no-store'
  })

  if (!response.ok) {
    const errorData = await response.json();


    throw new Error(
      `${errorData.status}|${errorData.message}`
    );
  }

  const data = await response.json();
  console.log('수강신청', data);

  return data;
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