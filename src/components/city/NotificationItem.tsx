import DeleteModal from "@/features/modal/DeleteModal";
import { X } from "lucide-react"
import Link from "next/link";

interface NotificationItemProps {
    type: 'friend' | 'calendar' | 'community';
    content: string;
    onClose: () => void;
    isRead: boolean;
    targetId: number;
}

const titleList = {
    friend: '친구 요청',
    calendar: '일정 확인',
    community: '새로운 댓글'
}

export default function NotificationItem({
    type,
    onClose,
    content,
    isRead,
    targetId
}: NotificationItemProps) {



    const title =
        type === "friend" ? "친구요청"
            : type === "calendar" ? "일정 확인"
                : type === "community" ? "새로운 댓글"
                    : "기타"




    const handleDelete = async () => {
        console.log(title)
    }

    const handleClick = async () => {
        onClose();
    }

    const href =
        type === "friend" ? "/student/phone/friends?status=request"
            : type === "calendar" ? `/student/phone/calendar?month=${targetId}`
                : type === "community" ? `/student/phone/community/${targetId}`
                    : "기타"

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
