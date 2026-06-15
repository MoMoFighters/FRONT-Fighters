import type { LucideIcon } from "lucide-react";

interface AdminDashboardMetricCardProps {
    title: string;
    value: string;
    previousLabel: string;
    change: string;
    icon: LucideIcon;
    tone?: "indigo" | "emerald" | "amber" | "rose";
    changeTone?: "indigo" | "emerald" | "amber" | "rose";
    badge?: string;
}

const ICON_TONE_CLASS = {
    indigo: "bg-indigo-50 text-indigo-500",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-500",
};

const CHANGE_TONE_CLASS = {
    indigo: "text-indigo-500",
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    rose: "text-rose-500",
};

// 상단 KPI 카드는 관리자 목업처럼 작은 정보 밀도와 상태 배지를 함께 보여줍니다.
export default function AdminDashboardMetricCard({
    title,
    value,
    previousLabel,
    change,
    icon: Icon,
    tone = "indigo",
    changeTone = "indigo",
    badge,
}: AdminDashboardMetricCardProps) {
    return (
        <section className="relative rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm">
            {badge && (
                <span className="absolute right-4 top-4 rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-amber-600">
                    {badge}
                </span>
            )}

            <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${ICON_TONE_CLASS[tone]}`}>
                    <Icon className="h-6 w-6" />
                </div>

                <div>
                    <p className="text-xs font-bold text-slate-500">
                        {title}
                    </p>

                    <p className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                        {value}
                    </p>
                </div>
            </div>

            <div className="mt-5 flex items-center gap-5 text-xs font-bold">
                <span className="text-slate-400">
                    {previousLabel}
                </span>

                <span className={CHANGE_TONE_CLASS[changeTone]}>
                    ▲ {change}
                </span>
            </div>
        </section>
    );
}
