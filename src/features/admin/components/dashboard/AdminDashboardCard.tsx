import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface AdminDashboardCardProps {
    title: string;
    href?: string;
    icon?: LucideIcon;
    subtitle?: string;
    children: React.ReactNode;
}

// 대시보드의 테이블/리스트 패널이 같은 헤더와 테두리를 공유하도록 만든 공통 프레임입니다.
export default function AdminDashboardCard({
    title,
    href,
    icon: Icon,
    subtitle,
    children,
}: AdminDashboardCardProps) {
    return (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm ">
            <div className="flex h-14 items-center justify-between border-b border-slate-100 px-5">
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="h-5 w-5 text-slate-700" />}

                    <h2 className="text-base font-black text-slate-950">
                        {title}
                    </h2>

                    {subtitle && (
                        <span className="text-xs font-bold text-slate-400">
                            {subtitle}
                        </span>
                    )}
                </div>

                {href && (
                    <Link
                        href={href}
                        className="text-xs font-bold text-slate-400 transition hover:text-slate-900"
                    >
                        전체 보기
                    </Link>
                )}
            </div>

            {children}
        </section>
    );
}
