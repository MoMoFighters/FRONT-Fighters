'use server'

import { CreateReport } from "@/app/services/report/service";
import { CreateReportRequest } from "./type";

export const CreateReportAction = async (payload: CreateReportRequest) => {
    const result = await CreateReport(payload);

    return result;
}