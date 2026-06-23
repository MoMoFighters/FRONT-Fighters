export type AccessLogRole = "STUDENT" | "TEACHER" | "ADMIN";

export interface AdminAccessLog {
    id: number;
    country: string;
    ipAddress: string;
    accessedAt: string;
    isSuccess: boolean;
    user?: {
        name: string;
        role: AccessLogRole;
    };
}
