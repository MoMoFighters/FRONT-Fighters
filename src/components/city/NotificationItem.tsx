import DeleteModal from "@/features/modal/DeleteModal";
import {
    deleteNoticeAction,
    readNoticeAction,
} from "@/features/user/components/notification/action";
import { X } from "lucide-react"
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NotificationItemProps {
    id: number;
    type: 'friend' | 'calendar' | 'community' | 'message';
    content: string;
    onClose: () => void;
    isRead: boolean;
    targetId: number;
}

export default function NotificationItem({
    id,
    type,
    onClose,
    content,
    isRead,
    targetId
}: NotificationItemProps) {
    const router = useRouter();

    const isFriendRequest =
        content.includes("친구 요청")

    const title =
        type === 'message' ? "메시지 확인" :
            type === "calendar" ? "일정 확인"
                : type === "community" ? "새로운 댓글"
                    : type === "friend" ? isFriendRequest ? "새로운 요청" : "요청 수락"
                        : "기타"

    const handleDelete = async () => {
        await deleteNoticeAction([id]);
    }

    const href =
        type === 'message' ? `/student/phone/friends?status=friend&roomId=${targetId}` :
            type === "calendar" ? "/student/phone/calendar"
                : type === "community" ? `/student/phone/community/${targetId}`
                    : type === "friend" ? isFriendRequest ? "/student/phone/friends?status=request"
                        : `/student/phone/friends?status=friend&friendId=${targetId}`
                        : "/student"

    const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        if (!isRead) {
            await readNoticeAction([id]);
        }

        onClose();
        router.push(href);
    }

    return (
        <Link
            href={href}
            onClick={handleClick}
            className="block w-full"
        >
            <article className="w-full bg-white/25 py-2 px-4 flex flex-row items-center border-b border-slate-500/30 hover:bg-white/90 hover:shadow-sm cursor-pointer transition-all">
                {isRead ? (
                    <div className="mb-5 h-2 w-2 rounded-full mr-2" />
                ) : (
                    <div className="mb-5 h-2 w-2 rounded-full bg-red-500 mr-2" />
                )}

                <div className="min-w-0 flex-1 flex flex-row items-center gap-3">
                    <div className="flex min-w-0 flex-col justify-between w-full">
                        <h3 className="font-bold text-sm text-slate-800">{title}</h3>
                        <p className="truncate text-xs">{content}</p>
                    </div>
                </div>
                <div onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
                    <DeleteModal
                        title={'알림 삭제'}
                        description="지워진 알림은 다시 볼 수 없습니다."
                        onDelete={handleDelete}
                        trigger={
                            <button
                                type="button"
                                className="w-6 h-6 p-0.5 hover:bg-rose-100 rounded-full text-slate-500 hover:text-rose-500 flex items-center transition-colors"
                            >
                                <X />
                            </button>
                        }
                    />
                </div>

            </article>
        </Link >
    );
}
