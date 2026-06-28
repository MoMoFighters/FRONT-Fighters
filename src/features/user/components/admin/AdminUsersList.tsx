import { SearchX } from "lucide-react";

import { UserList } from "@/features/user/type";
import AdminUserItem from "./AdminUserItem";

interface AdminUsersListProps {
    users: UserList[];
    view: "all" | "deleted";
}

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
                {isDeletedView ? null : <span className="text-center">제재 누적 횟수</span>}
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
                        <AdminUserItem
                            key={user.userId}
                            user={user}
                            view={view}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
