import { Notice } from "@/features/notice/type";

interface StudentNoticeItemProps {
    notice: Notice;
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
            className="flex py-3 w-full cursor-pointer justify-between rounded-2xl border border-slate-100 bg-white p-3 text-left shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/70"
        >
            <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-black text-slate-800">
                {notice.title}
            </p>
            <p className="items-center justify-end gap-2 text-xs font-bold text-slate-400 flex flex-row">
                {notice.createdAt.split('T')[0]}
                <span>
                    {notice.createdAt.split('T')[1]}
                </span>
            </p>
        </button>
    );
}
