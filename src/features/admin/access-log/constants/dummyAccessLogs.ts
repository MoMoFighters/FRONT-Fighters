import { AdminAccessLog } from "@/features/admin/access-log/type";

const BASE_ACCESS_LOGS: AdminAccessLog[] = [
    {
        id: 1,
        country: "대한민국",
        ipAddress: "211.234.56.78",
        accessedAt: "2026-06-23 14:21:32",
        isSuccess: true,
        user: { name: "김민수", role: "STUDENT" },
    },
    {
        id: 2,
        country: "대한민국",
        ipAddress: "211.234.56.78",
        accessedAt: "2026-06-23 14:18:05",
        isSuccess: true,
        user: { name: "관리자", role: "ADMIN" },
    },
    {
        id: 3,
        country: "일본",
        ipAddress: "153.125.84.21",
        accessedAt: "2026-06-23 13:46:18",
        isSuccess: false,
    },
    {
        id: 4,
        country: "대한민국",
        ipAddress: "175.198.45.67",
        accessedAt: "2026-06-23 13:27:44",
        isSuccess: true,
        user: { name: "이하나", role: "TEACHER" },
    },
    {
        id: 5,
        country: "미국",
        ipAddress: "104.28.78.90",
        accessedAt: "2026-06-23 12:41:33",
        isSuccess: false,
    },
    {
        id: 6,
        country: "싱가포르",
        ipAddress: "18.136.55.210",
        accessedAt: "2026-06-23 11:24:10",
        isSuccess: false,
    },
];

// TODO: 접근 로그 전체 조회 API가 준비되면 이 더미 데이터와 교체한다.
export const DUMMY_ACCESS_LOGS = Array.from({ length: 23 }, (_, index) => {
    const baseLog = BASE_ACCESS_LOGS[index % BASE_ACCESS_LOGS.length];
    const hour = String(14 - Math.floor(index / 2)).padStart(2, "0");

    return {
        ...baseLog,
        id: index + 1,
        ipAddress: index < BASE_ACCESS_LOGS.length
            ? baseLog.ipAddress
            : `${baseLog.ipAddress.split(".").slice(0, 3).join(".")}.${(index * 17) % 255}`,
        accessedAt: `2026-06-${String(23 - Math.floor(index / 6)).padStart(2, "0")} ${hour}:${String((index * 7) % 60).padStart(2, "0")}:${String((index * 13) % 60).padStart(2, "0")}`,
    };
});
