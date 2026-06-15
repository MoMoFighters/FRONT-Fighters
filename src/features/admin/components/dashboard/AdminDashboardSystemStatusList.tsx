import { CheckCircle2 } from "lucide-react";

export interface AdminDashboardSystemStatus {
    id: number;
    name: string;
    status: "정상" | "주의";
}

// 시스템 상태는 목업처럼 한 줄 안에서 주요 서비스 헬스만 빠르게 확인하게 구성합니다.
export default function AdminDashboardSystemStatusList({
    statuses,
}: {
    statuses: AdminDashboardSystemStatus[];
}) {
    return (
        <div className="grid grid-cols-4 px-5 py-6">
            {statuses.map((status) => (
                <div
                    key={status.id}
                    className="flex items-center justify-center gap-2 border-r border-slate-100 last:border-r-0"
                >
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />

                    <div>
                        <p className="text-xs font-bold text-slate-500">
                            {status.name}
                        </p>

                        <p className="text-xs font-black text-emerald-600">
                            {status.status}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
