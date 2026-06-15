import { Pin } from "lucide-react";

export interface AdminDashboardNotice {
    id: number;
    title: string;
    writer: string;
    date: string;
    pinned?: boolean;
    isNew?: boolean;
}

export default function AdminDashboardNoticeList({
    notices,
}: {
    notices: AdminDashboardNotice[];
}) {
    return (
        <div className="px-5 pb-7 pt-3">
            {notices.map((notice) => (
                <div
                    key={notice.id}
                    className="grid grid-cols-[minmax(0,1fr)_80px_92px_20px] items-center border-b border-slate-100 py-3 last:border-b-0"
                >
                    <div className="flex min-w-0 items-center gap-3">
                        <span className={`h-1.5 w-1.5 rounded-full ${notice.pinned ? "bg-indigo-500" : "bg-slate-300"}`} />

                        <p className="truncate text-xs font-bold text-slate-800">
                            {notice.title}
                        </p>

                        {notice.isNew && (
                            <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-black text-indigo-500">
                                NEW
                            </span>
                        )}
                    </div>

                    <span className="text-xs font-semibold text-slate-500">
                        {notice.writer}
                    </span>

                    <span className="text-xs font-semibold text-slate-400">
                        {notice.date}
                    </span>

                    {notice.pinned && <Pin className="h-3.5 w-3.5 fill-slate-700 text-slate-700" />}
                </div>
            ))}
        </div>
    );
}
