import type { ApiResponse } from "@/lib/api";

export interface StudentFriendData {
    userId: number;
    nickname: string;
    role: "STUDENT";
    status: "FRIEND";
    profileImageUrl?: string;
}

export type StudentFriendListResponse = ApiResponse<StudentFriendData[]>;
