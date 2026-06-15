export interface AdminDashboardAccessLog {
    id: number;
    country: string;
    ip: string;
    account: string;
    accessedAt: string;
    status: "성공" | "차단";
}

const STATUS_CLASS = {
    "성공": "bg-emerald-50 text-emerald-600",
    "차단": "bg-rose-50 text-rose-500",
};

export default function AdminDashboardAccessLogList({
    logs,
}: {
    logs: AdminDashboardAccessLog[];
}) {
    return (
        <div className="divide-y divide-slate-100 px-5">
            {logs.map((log) => (
                <div key={log.id} className="grid grid-cols-[76px_112px_80px_minmax(0,1fr)_54px] items-center gap-3 py-3 text-xs">
                    <span className="rounded-md bg-slate-50 px-2 py-1 text-center font-bold text-slate-500">
                        {log.country}
                    </span>

                    <span className="font-semibold text-slate-500">
                        {log.ip}
                    </span>

                    <span className="font-semibold text-slate-500">
                        {log.account}
                    </span>

                    <span className="font-semibold text-slate-400">
                        {log.accessedAt}
                    </span>

                    <span className={`rounded-md px-2 py-1 text-center font-black ${STATUS_CLASS[log.status]}`}>
                        {log.status}
                    </span>
                </div>
            ))}
        </div>
    );
}
