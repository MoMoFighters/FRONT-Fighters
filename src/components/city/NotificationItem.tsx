import { X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NotificationItemProps {
    id: number;
    type: "friend" | "calendar" | "community" | "message";
    content: string;
    onClose: () => void;
    isRead: boolean;
    targetId: number;
    isSelected: boolean;
    onSelectChange: (isSelected: boolean) => void;
    onRead: () => Promise<void>;
    onDelete: () => Promise<void>;
}

export default function NotificationItem({
    type,
    onClose,
    content,
    isRead,
    targetId,
    isSelected,
    onSelectChange,
    onRead,
    onDelete,
}: NotificationItemProps) {
    const router = useRouter();

    const isFriendRequest = content.includes("친구 요청");

    const title =
        type === "message"
            ? "메시지 확인"
            : type === "calendar"
                ? "일정 확인"
                : type === "community"
                    ? "새로운 댓글"
                    : type === "friend"
                        ? isFriendRequest
                            ? "새로운 요청"
                            : "요청 수락"
                        : "기타";

    const href =
        type === "message"
            ? `/student/friends?status=friend&roomId=${targetId}`
            : type === "calendar"
                ? "/student/calendar"
                : type === "community"
                    ? `/student/community/${targetId}`
                    : type === "friend"
                        ? isFriendRequest
                            ? "/student/friends?status=request"
                            : `/student/friends?status=friend&friendId=${targetId}`
                        : "/student";

    const handleClick = async (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();

        if (!isRead) {
            await onRead();
        }

        onClose();
        router.push(href);
    };

    const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation();
        onSelectChange(event.target.checked);
    };

    const handleDelete = async (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.stopPropagation();
        event.preventDefault();
        await onDelete();
    };

    return (
        <Link
            href={href}
            onClick={handleClick}
            className="block w-full"
        >
            <article className="flex w-full cursor-pointer flex-row items-center border-b border-slate-500/30 bg-white/25 px-4 py-2 transition-all hover:bg-white/90 hover:shadow-sm">
                {isRead ? (
                    <div className="mb-5 mr-2 h-2 w-2 rounded-full" />
                ) : (
                    <div className="mb-5 mr-2 h-2 w-2 rounded-full bg-red-500" />
                )}

                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={handleSelect}
                    onClick={(event) => event.stopPropagation()}
                    className="mr-3 h-3.5 w-3.5 shrink-0 accent-indigo-500"
                    aria-label="알림 선택"
                />

                <div className="flex min-w-0 flex-1 flex-row items-center gap-3">
                    <div className="flex min-w-0 w-full flex-col justify-between">
                        <h3 className="text-sm font-bold text-slate-800">
                            {title}
                        </h3>
                        <p className="truncate text-xs">
                            {content}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleDelete}
                    className="flex h-6 w-6 items-center rounded-full p-0.5 text-slate-500 transition-colors hover:bg-rose-100 hover:text-rose-500"
                    aria-label="알림 삭제"
                >
                    <X />
                </button>
            </article>
        </Link>
    );
}
