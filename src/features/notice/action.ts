"use server";

import {
    createNotice,
    deleteNoticeById,
    deleteNoticeByIds,
    getNoticeById,
    getNotices,
    pinNoticeById,
    unPinNoticeById,
    updateNoticeById,
} from "@/app/services/notice/service";
import { revalidatePath, revalidateTag } from "next/cache";
import { CreateNoticeRequest, Notice, NoticeListResponse, UpdateNoticeRequest } from "./type";

export type NoticeActionState = {
    success: boolean;
    message?: string;
    errors?: Record<string, string>;
    values?: {
        title: string;
        content: string;
    };
};

const getNoticeFormValues = (formData: FormData) => {
    // 유효성 실패 시 입력값을 폼에 다시 돌려주기 위해 값을 한곳에서 정리한다.
    const title = String(formData.get("title") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();

    return {
        title,
        content,
    };
};

const validateNoticeForm = ({
    title,
    content,
}: {
    title: string;
    content: string;
}) => {
    const errors: Record<string, string> = {};

    if (title.length === 0) {
        errors.title = "제목을 입력해주세요.";
    }

    if (content.length === 0) {
        errors.content = "내용을 입력해주세요.";
    }

    return errors;
};

const getActionErrorMessage = (error: unknown) => {
    // 서비스 함수에서 던진 status|message 형식은 관리자에게 message 위주로 보여준다.
    if (error instanceof Error) {
        const [status, message] = error.message.split("|");

        if (/^\d+$/.test(status) && message) {
            return `${message} (${status})`;
        }

        return error.message;
    }

    if (typeof error === "string") {
        return error;
    }

    if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
    ) {
        return error.message;
    }

    return "알 수 없는 오류가 발생했습니다.";
};

// 공지사항 등록 액션 함수
export const createNoticeFormAction = async (
    prevState: NoticeActionState,
    formData: FormData,
): Promise<NoticeActionState> => {
    const values = getNoticeFormValues(formData);
    const errors = validateNoticeForm(values);

    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            message: "유효성 검사 실패",
            errors,
            values,
        };
    }

    const payload: CreateNoticeRequest = {
        ...values,
        isPinned: false,
    };

    try {
        await createNotice(payload);
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error),
            values,
        };
    }

    revalidatePath("/admin/notices");
    revalidateTag("notices", { expire: 0 });

    return {
        success: true,
    };
};

// 공지사항 수정 액션 함수
export const updateNoticeFormAction = async (
    id: string,
    prevState: NoticeActionState,
    formData: FormData,
): Promise<NoticeActionState> => {
    const values = getNoticeFormValues(formData);
    const errors = validateNoticeForm(values);

    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            message: "유효성 검사 실패",
            errors,
            values,
        };
    }

    const payload: UpdateNoticeRequest = {
        ...values,
    };

    try {
        await updateNoticeById(id, payload);
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error),
            values,
        };
    }

    revalidatePath("/admin/notices");
    revalidatePath(`/admin/notices/${id}`);
    revalidateTag("notices", { expire: 0 });

    return {
        success: true,
    };
};

// 공지사항 삭제 액션 함수
export const deleteNoticeAction = async (ids: string[]): Promise<NoticeActionState> => {
    if (ids.length === 0) {
        return {
            success: false,
            message: "삭제할 공지사항을 선택해주세요.",
        };
    }

    try {
        // 1개 선택은 단건 삭제 API, 2개 이상은 일괄 삭제 API를 호출한다.
        if (ids.length === 1) {
            await deleteNoticeById(ids[0]);
        } else {
            await deleteNoticeByIds(ids);
        }
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error),
        };
    }

    revalidatePath("/admin/notices");
    revalidateTag("notices", { expire: 0 });

    return {
        success: true,
    };
};

// 공지사항 고정/고정 해제 액션 함수
export const updateNoticePinAction = async (
    id: string,
    shouldPin: boolean,
): Promise<NoticeActionState> => {
    try {
        if (shouldPin) {
            await pinNoticeById(id);
        } else {
            await unPinNoticeById(id);
        }
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error),
        };
    }

    revalidatePath("/admin/notices");
    revalidatePath(`/admin/notices/${id}`);
    revalidateTag("notices", { expire: 0 });

    return {
        success: true,
    };
};

export const getNoticesAction = async (
    page: number
): Promise<NoticeListResponse> => {
    return await getNotices(page);
};

export const getNoticeAction = async (
    noticeId: number
): Promise<Notice> => {
    return await getNoticeById(String(noticeId))
}