import Link from "next/link";

import { UserResponse } from "@/features/user/type";
import AdminUserStatusBadge from "./AdminUserStatusBadge";

interface AdminUserItemProps {
    user: UserResponse;
    view: "all" | "deleted";
}

const getRoleLabel = (role: string) => role === "TEACHER" ? "강사" : "수강생";

const getMockReportCount = (userId: number) => {
    // TODO: 회원 전체 조회 API에 reportCount가 추가되면 이 더미 계산을 응답값으로 교체한다.
    return userId % 4;
};

const getMockSuspensionPeriod = (user: UserResponse) => {
    // TODO: 회원 전체 조회 API에 suspensionPeriod가 추가되면 이 더미 값을 제거한다.
    if (user.status === "BANNED") return "2026-07-03까지";
    if (user.status === "BLACK") return "영구";
    return "";
};

export default function AdminUserItem({ user, view }: AdminUserItemProps) {
    const isDeletedView = view === "deleted";

    return (
        <Link
            href={isDeletedView
                ? `/admin/users/${user.id}?status=deleted`
                : `/admin/users/${user.id}`}
            className={`group grid min-w-[900px] ${isDeletedView ? "grid-cols-[1.1fr_.8fr_1.8fr_.9fr_.8fr]" : "grid-cols-[1.05fr_.75fr_1.8fr_.85fr_.75fr_.85fr_1.15fr]"} items-center px-6 py-4 text-sm text-slate-600 transition hover:bg-slate-50`}
        >
            <span className="w-fit font-bold text-slate-900 transition group-hover:text-indigo-600">
                {user.name}
            </span>
            <span>{getRoleLabel(user.role)}</span>
            <span className="truncate pr-5">{user.email ?? "이메일 정보 없음"}</span>
            <span>
                {isDeletedView
                    ? user.deletedAt?.split("T")[0] ?? "-"
                    : user.createdAt?.split("T")[0] ?? "-"}
            </span>
            <div className="flex justify-center">
                <AdminUserStatusBadge status={isDeletedView ? "DELETED" : user.status} />
            </div>
            {!isDeletedView && (
                <span className="text-center text-sm font-bold text-slate-700">
                    {getMockReportCount(user.id)}회
                </span>
            )}
            {!isDeletedView && (
                <span className="pl-6 text-xs font-semibold text-slate-500">
                    {getMockSuspensionPeriod(user)}
                </span>
            )}
        </Link>
    );
}
