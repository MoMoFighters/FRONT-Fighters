export interface AdminDashboardAccessLog {
    id: number;
    ip: string;
    action: "로그인 시도" | "로그아웃" | "접근 거부";
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

                    <span className="min-w-20 font-semibold text-slate-500">
                        {log.action}
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
