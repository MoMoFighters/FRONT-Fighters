'use server'

import { deleteReviewById } from "@/app/services/lecture/service";
import { CreateReport, resolveReport } from "@/app/services/report/service";
import { plusReportCount } from "@/app/services/user/service";
import { revalidatePath } from "next/cache";
import {
    CreateReportRequest,
    ReportActionResult,
} from "./type";

export const CreateReportAction = async (payload: CreateReportRequest) => {
    const result = await CreateReport(payload);

    return result;
}

const getReportActionErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
        const [status, message] = error.message.split("|");

        if (/^\d+$/.test(status) && message) {
            return message;
        }

        return error.message;
    }

    return "신고 처리 중 문제가 발생했습니다.";
};

export const resolveReportAction = async (
    reportId: string,
): Promise<ReportActionResult> => {
    try {
        await resolveReport(reportId);
        revalidatePath("/admin/reports");
        revalidatePath(`/admin/reports/${reportId}`);

        return {
            success: true,
            message: "신고를 처리 완료했습니다.",
        };
    } catch (error) {
        return {
            success: false,
            message: getReportActionErrorMessage(error),
        };
    }
};

export const sanctionReportedUserAction = async ({
    reportId,
    reportedUserId,
}: {
    reportId: string;
    reportedUserId: string;
}): Promise<ReportActionResult> => {
    try {
        await plusReportCount(reportedUserId);
        await resolveReport(reportId);
        revalidatePath("/admin/reports");
        revalidatePath(`/admin/reports/${reportId}`);

        return {
            success: true,
            message: "신고 처리를 승인했습니다.",
        };
    } catch (error) {
        return {
            success: false,
            message: getReportActionErrorMessage(error),
        };
    }
};

export const deleteReportedReviewAction = async ({
    reportId,
    reviewId,
}: {
    reportId: string;
    reviewId: string;
}): Promise<ReportActionResult> => {
    try {
        await deleteReviewById(reviewId);
        await resolveReport(reportId);
        revalidatePath("/admin/reports");
        revalidatePath(`/admin/reports/${reportId}`);

        return {
            success: true,
            message: "수강평 삭제 후 신고를 처리 완료했습니다.",
        };
    } catch (error) {
        return {
            success: false,
            message: getReportActionErrorMessage(error),
        };
    }
};
