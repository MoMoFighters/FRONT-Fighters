"use server";

import {
    createNotice,
    deleteNoticeById,
    deleteNoticeByIds,
    updateNoticeById,
} from "@/app/services/notice/service";
import { revalidatePath } from "next/cache";
import { CreateNoticeRequest, UpdateNoticeRequest } from "./type";

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

    return {
        success: true,
    };
};
