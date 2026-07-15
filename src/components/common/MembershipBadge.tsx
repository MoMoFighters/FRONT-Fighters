import { Membership } from "@/features/user/type";

const MEMBERSHIP_BADGE_STYLE: Record<Membership, string> = {
    BASIC:
        'border border-zinc-300 bg-zinc-200/50 text-zinc-700',

    PLUS:
        'border border-zinc-400 text-zinc-800 bg-[linear-gradient(135deg,#ffffff_0%,#e5e7eb_25%,#9ca3af_50%,#e5e7eb_75%,#ffffff_100%)] shadow-[inset_0_1px_1px_rgba(255,255,255,.7),0_1px_2px_rgba(0,0,0,.12)]',

    PRO:
        'border border-yellow-500 text-yellow-900 bg-[linear-gradient(135deg,#fff7cc_0%,#fcd34d_25%,#f59e0b_50%,#fcd34d_75%,#fff7cc_100%)] shadow-[inset_0_1px_1px_rgba(255,255,255,.6),0_1px_2px_rgba(0,0,0,.12)]',
};

export const formatMembershipUntil = (value?: string | null) => {
    const date = value ? new Date(value) : null;

    if (!date || Number.isNaN(date.getTime())) {
        return null;
    }

    return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(date);
};

interface MembershipBadgeProps {
    membership?: Membership;
    membershipUntil?: string | null;
    className?: string;
}

export default function MembershipBadge({
    membership,
    membershipUntil,
    className = "rounded-full px-2 py-0.5 text-[11px] font-bold",
}: MembershipBadgeProps) {
    const resolvedMembership = membership ?? "BASIC";
    const formattedUntil =
        resolvedMembership !== "BASIC" ? formatMembershipUntil(membershipUntil) : null;

    return (
        <span
            title={formattedUntil ? `~${formattedUntil}` : undefined}
            className={`${className} ${MEMBERSHIP_BADGE_STYLE[resolvedMembership]}`}
        >
            <p className="select-none">
                {resolvedMembership}
            </p>
        </span>
    );
}
