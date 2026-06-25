export interface StudentNoticeListItem {
    noticeId: number;
    title: string;
    summary: string;
    createdAt: string;
    viewCount: number;
}

interface StudentNoticeItemProps {
    notice: StudentNoticeListItem;
    onClick: (noticeId: number) => void;
}

export default function StudentNoticeItem({
    notice,
    onClick,
}: StudentNoticeItemProps) {
    return (
        <button
            type="button"
            onClick={() => onClick(notice.noticeId)}
            className="flex h-20 w-full cursor-pointer flex-col justify-between rounded-2xl border border-slate-100 bg-white p-3 text-left shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/70"
        >
            <div className="min-w-0">
                <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-black text-slate-800">
                    {notice.title}
                </p>
                <p className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs font-semibold leading-4 text-slate-400">
                    {notice.summary}
                </p>
            </div>

            <div className="flex items-center justify-between gap-2 text-xs font-bold text-slate-400">
                <time>
                    {notice.createdAt}
                </time>
                <span>
                    조회 {notice.viewCount.toLocaleString()}
                </span>
            </div>
        </button>
    );
}
