import UpdateFriendStatusBtn from "@/features/phone/components/buttons/UpdateFriendStatusBtn";
import Image from "next/image";
import Link from "next/link";

interface FriendInfo {
    userId: number;
    name: string;
    status: "none" | "SENT" | "FRIEND" | "RECEIVED" | "BLOCK";
    profile: string;
}

interface FriendItemProps {
    friendInfo: FriendInfo;
    showActions?: boolean;
    href?: string;
    selected?: boolean;
}

export default function FriendItem({
    friendInfo,
    showActions = true,
    href,
    selected = false,
}: FriendItemProps) {
    const { name, profile, userId } = friendInfo;
    const status = friendInfo.status ?? null;

    const content = (
        <div
            className={`
                flex flex-row items-center gap-3 rounded-xl border px-4 py-3 transition-colors
                ${selected
                    ? "border-mauve-200 bg-mauve-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }
                ${href ? "cursor-pointer" : ""}
            `}
        >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-50">
                {profile ? (
                    <Image
                        src={profile}
                        alt="프로필"
                        width={44}
                        height={44}
                        className="h-11 w-11 object-cover"
                    />
                ) : (
                    <p className="font-bold text-indigo-600">
                        {name[0]}
                    </p>
                )}
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-slate-800">
                    {name}
                </p>
            </div>

            {showActions && (
                <UpdateFriendStatusBtn
                    data={{ status, userId }}
                />
            )}
        </div>
    );

    if (href) {
        return (
            <Link href={href}>
                {content}
            </Link>
        );
    }

    return content;
}