import { SearchX } from "lucide-react";

import { UserResponse } from "@/features/user/type";
import AdminUserStatusBadge from "./AdminUserStatusBadge";

interface AdminUsersListProps {
    users: UserResponse[];
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

export default function AdminUsersList({ users, view }: AdminUsersListProps) {
    const isDeletedView = view === "deleted";

    return (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className={`grid min-w-[900px] ${isDeletedView ? "grid-cols-[1.1fr_.8fr_1.8fr_.9fr_.8fr]" : "grid-cols-[1.05fr_.75fr_1.8fr_.85fr_.75fr_.85fr_1.15fr]"} border-b border-slate-200 bg-slate-50 px-6 py-3 text-xs font-bold text-slate-500`}>
                <span>이름</span>
                <span>사용자 유형</span>
                <span>이메일</span>
                <span>{isDeletedView ? "탈퇴일" : "가입일"}</span>
                <span className="text-center">상태</span>
                {isDeletedView ? null : <span className="text-center">신고 횟수</span>}
                {isDeletedView ? null : <span className="pl-6">정지 기간</span>}
            </div>

            {users.length === 0 ? (
                <div className="flex h-72 flex-col items-center justify-center gap-3 text-slate-400">
                    <SearchX className="size-10" />
                    <p className="text-base font-bold">조회된 회원이 없습니다.</p>
                </div>
            ) : (
                <div className="divide-y divide-slate-100">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className={`group grid min-w-[900px] ${isDeletedView ? "grid-cols-[1.1fr_.8fr_1.8fr_.9fr_.8fr]" : "grid-cols-[1.05fr_.75fr_1.8fr_.85fr_.75fr_.85fr_1.15fr]"} items-center px-6 py-4 text-sm text-slate-600 transition hover:bg-slate-50`}
                        >
                            <span className="w-fit font-bold text-slate-900">
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
                            {isDeletedView ? null : (
                                <span className="text-center text-sm font-bold text-slate-700">
                                    {getMockReportCount(user.id)}회
                                </span>
                            )}
                            {!isDeletedView && (
                                <span className="pl-6 text-xs font-semibold text-slate-500">
                                    {getMockSuspensionPeriod(user)}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
