export interface AdminDashboardAccessLog {
    id: number;
    ip: string;
    user: string;
    accessedAt: string;
    status: "성공" | "실패";
}

const STATUS_CLASS = {
    "성공": "bg-emerald-50 text-emerald-600",
    "실패": "bg-rose-50 text-rose-500",
};

export default function AdminDashboardAccessLogList({
    logs,
}: {
    logs: AdminDashboardAccessLog[];
}) {
    return (
        <div className="divide-y divide-slate-100 px-5">
            {logs.map((log) => (
                <div
                    key={log.id}
                    className="flex items-center justify-between gap-6 py-3 text-xs"
                >

                    <span className="min-w-28 font-semibold text-slate-500">
                        {log.ip}
                    </span>

                    <span className="min-w-24 font-semibold text-slate-500">
                        {log.user}
                    </span>

                    <span className="min-w-32 font-semibold text-slate-400">
                        {log.accessedAt}
                    </span>

                    <span className={`min-w-14 rounded-md px-2 py-1 text-center font-black ${STATUS_CLASS[log.status]}`}>
                        {log.status}
                    </span>
                </div>
            ))}
        </div>
    );
}
