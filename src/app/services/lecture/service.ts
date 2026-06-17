import {
  ChapterProgress,
  EnrollLectureResponse,
  LectureListRequest,
  LectureDetail,
  LectureListResponse,
  LectureMetaResponse,
  LectureProgress,
  ResumeResponse,
  StatusRequest,
  UpdateVideoProgressByExitRequest,
  UpdateVideoProgressRequest,
  UpdateVideoProgressResponse,
} from "@/features/lecture/type";
import { ApiResponse, fetchWithAuth } from "@/lib/api";
import { notFound } from "next/navigation";

const assertApiData = <T>(result: ApiResponse<T>): T => {
  if (!result.data) {
    throw new Error(result.message);
  }

  return result.data;
};

const handleErrorResponse = async (response: Response) => {
  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      `${errorData.status}|${errorData.message}`
    );
  }
};

export const getLectures = async (
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

  const response = await fetchWithAuth(`/api/v1/lectures?${queryString}`);

  await handleErrorResponse(response);

  const result: ApiResponse<LectureListResponse> = await response.json();

  return assertApiData(result);
};

export const getLectureById = async (
  id: string
): Promise<LectureDetail> => {
  const response = await fetchWithAuth(`/api/v1/lectures/${id}`);

  await handleErrorResponse(response);

  const result: ApiResponse<LectureDetail> = await response.json();

  return assertApiData(result);
};

export const updateLectureStatus = async (
  id: string,
  payload: StatusRequest
) => {
  const response = await fetchWithAuth(`/api/v1/lectures/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  await handleErrorResponse(response);

  return response.json();
};

export const getLectureProgress = async (
  id: string
): Promise<LectureProgress> => {
  const response = await fetchWithAuth(`/api/v1/lectures/${id}/progress`);

  await handleErrorResponse(response);

  const result: ApiResponse<LectureProgress> = await response.json();

  return assertApiData(result);
};

export const getChaptersById = async (
  lectureId: string
): Promise<ChapterProgress[]> => {
  const response = await fetchWithAuth(
    `/api/v1/lectures/${lectureId}/chapters/progress`
  );

  await handleErrorResponse(response);

  const result: ApiResponse<
    ChapterProgress[] | { chapters: ChapterProgress[] }
  > = await response.json();

  const data = assertApiData(result);

  return Array.isArray(data) ? data : data.chapters;
};

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

export const getResumeInfo = async (
  lectureId: string,
  chapterId: string
): Promise<ResumeResponse> => {
  const response = await fetchWithAuth(
    `/api/v1/lectures/${lectureId}/chapters/${chapterId}/resume`
  );

  await handleErrorResponse(response);

  const result: ApiResponse<ResumeResponse> = await response.json();

  return assertApiData(result);
};

export const getLectureMeta = async (
  lectureId: string
): Promise<LectureMetaResponse> => {
  const response = await fetchWithAuth(`/api/v1/lectures/${lectureId}/meta`);

  await handleErrorResponse(response);

  const result: ApiResponse<LectureMetaResponse> = await response.json();

  return assertApiData(result);
};

export const getChapterVideo = async (
  lectureId: string,
  chapterId: string
): Promise<string> => {
  const response = await fetchWithAuth(
    `/api/v1/lectures/${lectureId}/chapters/${chapterId}/stream`
  );

  await handleErrorResponse(response);

  const result: ApiResponse<{ presignedUrl: string }> =
    await response.json();

  return assertApiData(result).presignedUrl;
};

export const enrollLectureById = async (
  id: string
): Promise<EnrollLectureResponse> => {
  const response = await fetchWithAuth(`/api/v1/lectures/${id}/enrollments`, {
    method: "POST",
  });

  await handleErrorResponse(response);

  return response.json();
};
