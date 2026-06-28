import { UserStatus } from "@/features/user/type";

const STATUS_LABEL: Record<string, string> = {
    ACTIVE: "활동 중",
    BANNED: "일시 정지",
    BLACK: "영구 정지",
    PENDING: "승인 대기",
    REJECTED: "승인 거절",
    DELETED: "탈퇴",
};

interface AdminUserStatusBadgeProps {
    status?: UserStatus;
}

export default function AdminUserStatusBadge({
    status,
}: AdminUserStatusBadgeProps) {
    const normalizedStatus = status ?? "ACTIVE";
    const className = normalizedStatus === "ACTIVE"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : normalizedStatus === "DELETED"
            ? "border-slate-200 bg-slate-100 text-slate-500"
            : normalizedStatus === "PENDING"
                ? "border-amber-200 bg-amber-50 text-amber-700"
                : "border-slate-200 bg-slate-100 text-slate-700";

    return (
        <span className={`inline-flex justify-self-start whitespace-nowrap rounded-md border px-2.5 py-1 text-xs font-bold ${className}`}>
            {STATUS_LABEL[normalizedStatus] ?? normalizedStatus}
        </span>
    );
}
