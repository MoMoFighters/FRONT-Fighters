import type { LucideIcon } from "lucide-react";

interface AdminDashboardMetricCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    tone?: "indigo" | "emerald" | "amber" | "rose";
    description?: string;
}

const ICON_TONE_CLASS = {
    indigo: "bg-indigo-50 text-indigo-500",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-500",
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
        <section className="rounded-lg border border-slate-200 bg-white px-6 py-6 shadow-sm">
            <div className="flex items-center gap-4">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${ICON_TONE_CLASS[tone]}`}>
                    <Icon className="h-6 w-6" />
                </div>

                <div>
                    <p className="text-sm font-bold text-slate-500">
                        {title}
                    </p>

                    <p className="mt-1 text-3xl font-black tracking-tight text-slate-950">
                        {value}
                    </p>
                </div>
            </div>

            {description && (
                <p className="mt-5 text-xs font-bold text-slate-400">
                    {description}
                </p>
            )}
        </section>
    );
}
