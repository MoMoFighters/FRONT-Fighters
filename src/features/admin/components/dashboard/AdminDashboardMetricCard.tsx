import type { LucideIcon } from "lucide-react";

interface AdminDashboardMetricCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    tone?: "indigo" | "emerald" | "amber" | "rose" | "violet";
    description?: string;
}

const ICON_TONE_CLASS = {
    indigo: "bg-indigo-50 text-indigo-500",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-500",
    violet: "bg-violet-50 text-violet-600",
};

// 상단 KPI 카드는 관리자 목업처럼 작은 정보 밀도와 상태 배지를 함께 보여줍니다.
export default function AdminDashboardMetricCard({
    title,
    value,
    icon: Icon,
    tone = "indigo",
    description,
}: AdminDashboardMetricCardProps) {
    return (
        <section className="min-w-0 rounded-lg border border-slate-200 bg-white px-4 py-5 shadow-sm">
            <div className="flex min-w-0 items-center gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${ICON_TONE_CLASS[tone]}`}>
                    <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-500">
                        {title}
                    </p>

                    <p className="mt-1 break-words text-lg font-black leading-tight tracking-tight text-slate-950">
                        {value}
                    </p>
                </div>
            </div>

            {description && (
                <p className="mt-4 truncate text-xs font-bold text-slate-400">
                    {description}
                </p>
            )}
        </section>
    );
}
