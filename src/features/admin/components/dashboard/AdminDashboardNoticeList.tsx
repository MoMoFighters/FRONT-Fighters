import Link from "next/link";
import { Pin } from "lucide-react";
import { AdminDashboardNotice } from "./type";

export default function AdminDashboardNoticeList({
    notices,
}: {
    notices: AdminDashboardNotice[];
}) {
    return (
        <div className="px-5 pb-5 pt-2">
            {notices.map((notice) => (
                <Link
                    key={notice.id}
                    href={`/admin/notices/${notice.id}`}
                    className="grid grid-cols-[minmax(0,1fr)_124px_20px] items-center border-b border-slate-100 py-2.5 transition hover:bg-slate-50 last:border-b-0"
                >
                    <div className="flex min-w-0 items-center gap-3">
                        <span className={`h-1.5 w-1.5 rounded-full ${notice.pinned ? "bg-indigo-500" : "bg-slate-300"}`} />

                        <p className="truncate text-xs font-bold text-slate-800">
                            {notice.title}
                        </p>
                    </div>

                    <span className="whitespace-nowrap text-xs font-bold text-slate-400">
                        {notice.date}
                    </span>

                    {notice.pinned && <Pin className="h-3.5 w-3.5 fill-slate-700 text-slate-700" />}
                </Link>
            ))}
        </div>
    );
}
