export interface GuestBookListItem {
    guestbookId: number;
    writerName: string;
    content: string;
    createdAt: string;
}

interface GuestBookItemProps {
    guestbook: GuestBookListItem;
    onClick: (guestbookId: number) => void;
}

export default function GuestBookItem({
    guestbook,
    onClick,
}: GuestBookItemProps) {
    return (
        <button
            type="button"
            onClick={() => onClick(guestbook.guestbookId)}
            className="flex h-24 w-full cursor-pointer flex-col justify-between rounded-2xl border border-indigo-100 bg-white p-3 text-left shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/70"
        >
            <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-black leading-5 text-slate-800">
                {guestbook.content}
            </p>

            <div className="flex items-center justify-between gap-2 text-xs font-bold text-slate-400">
                <span className="truncate">
                    {guestbook.writerName}
                </span>
                <time className="shrink-0">
                    {guestbook.createdAt}
                </time>
            </div>
        </button>
    );
}
