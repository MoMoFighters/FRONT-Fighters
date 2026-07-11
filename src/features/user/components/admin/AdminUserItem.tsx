import Link from "next/link";

import { USER_ROLE_LABEL, UserList } from "@/features/user/type";
import AdminUserStatusBadge from "./AdminUserStatusBadge";
import AdminMembershipBadge from "./AdminMembershipBadge";

interface AdminUserItemProps {
    user: UserList;
    view: "all" | "deleted";
}

const formatAdminDate = (dateTime?: string | null) => {
    if (!dateTime) {
        return "-";
    }

    return dateTime.replace("T", " ").slice(0, 10);
};

const getSuspensionPeriod = (user: UserList) => {
    if (user.status === "BLACK") {
        return "영구";
    }

    if (user.suspendedUntil) {
        return `${formatAdminDate(user.suspendedUntil)}까지`;
    }

    return "-";
};

export default function AdminUserItem({ user, view }: AdminUserItemProps) {
    const isDeletedView = view === "deleted";
    const href = isDeletedView
        ? `/admin/users/${user.userId}?status=deleted`
        : user.status === "PENDING"
            ? `/admin/users/${user.userId}?source=pending-teacher&from=all`
            : `/admin/users/${user.userId}`;

    return (
        <Link
            href={href}
            className={`group grid min-w-[900px] ${isDeletedView ? "grid-cols-[1.1fr_.8fr_1.8fr_.9fr_.8fr]" : "grid-cols-[1.05fr_.75fr_1.8fr_.85fr_.75fr_.7fr_.85fr_1.15fr]"} items-center px-6 py-4 text-sm text-slate-600 transition hover:bg-slate-50`}
        >
            <span className="w-fit font-bold text-slate-900 transition group-hover:text-indigo-600">
                {user.name}
            </span>
            <span>{USER_ROLE_LABEL[user.role]}</span>
            <span className="truncate pr-5">{user.email ?? "이메일 정보 없음(카카오 로그인 유저)"}</span>
            <span>
                {isDeletedView
                    ? "-"
                    : formatAdminDate(user.createdAt)}
            </span>
            <div className="flex justify-center">
                <AdminUserStatusBadge status={isDeletedView ? "DELETED" : user.status} />
            </div>
            {!isDeletedView && (
                <div className="flex justify-center">
                    <AdminMembershipBadge membership={user.membership} />
                </div>
            )}
            {!isDeletedView && (
                <span className="text-center text-sm font-bold text-slate-700">
                    {user.suspensionCount ?? 0}회
                </span>
            )}
            {!isDeletedView && (
                <span className="pl-6 text-xs font-semibold text-slate-500">
                    {getSuspensionPeriod(user)}
                </span>
            )}
        </Link>
    );
}
