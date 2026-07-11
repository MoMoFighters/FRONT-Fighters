import { Membership } from "@/features/user/type";

const MEMBERSHIP_STYLE: Record<Membership, string> = {
    BASIC: "border-slate-200 bg-slate-50 text-slate-600",
    PLUS: "border-sky-200 bg-sky-50 text-sky-700",
    PRO: "border-indigo-200 bg-indigo-50 text-indigo-700",
};

interface AdminMembershipBadgeProps {
    membership?: Membership;
}

export default function AdminMembershipBadge({
    membership,
}: AdminMembershipBadgeProps) {
    const normalized = membership ?? "BASIC";

    return (
        <span className={`inline-flex justify-self-start whitespace-nowrap rounded-md border px-2.5 py-1 text-xs font-bold ${MEMBERSHIP_STYLE[normalized]}`}>
            {normalized}
        </span>
    );
}
