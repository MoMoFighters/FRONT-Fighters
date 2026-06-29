import axios, { type AxiosProgressEvent } from "axios";

const BASE_SERVER_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface CreateLectureData {
    lectureId: number;
    teacherId: number;
    title: string;
    description: string;
    thumbnailUrl: string;
    category: "STUDY" | "BEAUTY" | "FITNESS" | "COOK" | "ART";
    lectureStatus: string;
    completedUserCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateLectureResponse {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data?: CreateLectureData;
    errors?: Record<string, unknown>;
}

export interface CreateChapterResponse {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data?: {
        chapterId: number;
        lectureId: number;
        title: string;
        orderNo: number;
        videoUrl: string | null;
        videoSizeBytes: number | null;
        chapterThumbnailUrl: string | null;
        durationSec: number | null;
        originalFilename: string | null;
        createdAt: string | null;
        updatedAt: string | null;
    };
    errors?: Record<string, unknown>;
}

export type LectureUploadProgressHandler = (progress: number) => void;

interface PreparedChapter {
    title: string;
    orderNo: number;
    durationSec: number;
    videoFile?: File;
    thumbnailFile?: File;
}

const getFormFile = (formData: FormData, key: string) => {
    const value = formData.get(key);

    return value instanceof File && value.size > 0 ? value : undefined;
};

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
    if (axios.isAxiosError(error)) {
        const responseData = error.response?.data as
            | { message?: string }
            | undefined;

        return responseData?.message ?? error.message ?? fallbackMessage;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallbackMessage;
};

const createProgressTracker = (
    formData: FormData,
    onProgress?: LectureUploadProgressHandler
) => {
    const chapterCount = Number(formData.get("chapterCount") ?? 0);
    const lectureThumbnail = getFormFile(formData, "thumbnail");
    let totalBytes = lectureThumbnail?.size ?? 1;
    let completedBytes = 0;

    for (let index = 1; index <= chapterCount; index += 1) {
        totalBytes += getFormFile(formData, `chapterThumbnail_${index}`)?.size ?? 1;
        totalBytes += getFormFile(formData, `video_${index}`)?.size ?? 1;
    }

    return (event: AxiosProgressEvent) => {
        const loaded = event.loaded ?? 0;
        const progress = Math.min(
            99,
            Math.round(((completedBytes + loaded) / totalBytes) * 100)
        );

        onProgress?.(progress);

        if (event.total && loaded >= event.total) {
            completedBytes += event.total;
        }
    };
};

export const createLecture = async (
    formData: FormData,
    accessToken: string,
    onUploadProgress?: (event: AxiosProgressEvent) => void,
    signal?: AbortSignal
): Promise<CreateLectureResponse> => {
    const backendFormData = new FormData();

    backendFormData.append("title", String(formData.get("title") ?? ""));
    backendFormData.append("description", String(formData.get("description") ?? ""));
    backendFormData.append("category", String(formData.get("category") ?? ""));

    const thumbnailFile = getFormFile(formData, "thumbnail");

    if (thumbnailFile) {
        backendFormData.append("thumbnail", thumbnailFile);
    }

    try {
        const response = await axios.post<CreateLectureResponse>(
            `${BASE_SERVER_URL}/api/v1/lectures`,
            backendFormData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                onUploadProgress,
                signal,
            }
        );

        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "강의 등록에 실패했습니다."));
    }
};

export const createChapter = async (
    lectureId: number,
    chapterData: {
        title: string;
        orderNo: number;
        thumbnailFile?: File;
    },
    accessToken: string,
    onUploadProgress?: (event: AxiosProgressEvent) => void,
    signal?: AbortSignal
): Promise<CreateChapterResponse> => {
    const chapterFormData = new FormData();
    chapterFormData.append("title", chapterData.title);
    chapterFormData.append("orderNo", String(chapterData.orderNo));

    if (chapterData.thumbnailFile) {
        chapterFormData.append("thumbnail", chapterData.thumbnailFile);
    }

    try {
        const response = await axios.post<CreateChapterResponse>(
            `${BASE_SERVER_URL}/api/v1/lectures/${lectureId}/chapters`,
            chapterFormData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                onUploadProgress,
                signal,
            }
        );

        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "챕터 생성에 실패했습니다."));
    }
};

export const uploadChapterVideo = async (
    lectureId: number,
    chapterId: number,
    videoFile: File,
    durationSec: number,
    accessToken: string,
    onUploadProgress?: (event: AxiosProgressEvent) => void,
    signal?: AbortSignal
) => {
    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("durationSec", String(durationSec));

    try {
        const response = await axios.patch(
            `${BASE_SERVER_URL}/api/v1/lectures/${lectureId}/chapters/${chapterId}/video`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                onUploadProgress,
                signal,
            }
        );

        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "챕터 동영상 등록에 실패했습니다."));
    }
};

export const createLectureWithChapters = async ({
    formData,
    accessToken,
    onProgress,
    signal,
}: {
    formData: FormData;
    accessToken: string;
    onProgress?: LectureUploadProgressHandler;
    signal?: AbortSignal;
}) => {
    const chapterCount = Number(formData.get("chapterCount") ?? 0);
    const savedChapters: PreparedChapter[] = [];
    const progressTracker = createProgressTracker(formData, onProgress);

    for (let index = 1; index <= chapterCount; index += 1) {
        const title = String(formData.get(`chapterTitle_${index}`) ?? "").trim();

        if (!title) {
            continue;
        }

        savedChapters.push({
            title,
            orderNo: index,
            durationSec: Number(formData.get(`durationSec_${index}`) ?? 0),
            videoFile: getFormFile(formData, `video_${index}`),
            thumbnailFile: getFormFile(formData, `chapterThumbnail_${index}`),
        });
    }

    const lectureResult = await createLecture(
        formData,
        accessToken,
        progressTracker,
        signal
    );
    const lectureId = lectureResult.data?.lectureId;

    if (!lectureId) {
        throw new Error("강의 생성 후 lectureId를 찾을 수 없습니다.");
    }

    for (const chapter of savedChapters) {
        const chapterResult = await createChapter(
            lectureId,
            {
                title: chapter.title,
                orderNo: chapter.orderNo,
                thumbnailFile: chapter.thumbnailFile,
            },
            accessToken,
            progressTracker,
            signal
        );
        const chapterId = chapterResult.data?.chapterId;

        if (!chapterId) {
            throw new Error("챕터 생성 후 chapterId를 찾을 수 없습니다.");
        }

        if (chapter.videoFile) {
            await uploadChapterVideo(
                lectureId,
                chapterId,
                chapter.videoFile,
                chapter.durationSec,
                accessToken,
                progressTracker,
                signal
            );
        }
    }

    onProgress?.(100);

    return lectureResult;
};
