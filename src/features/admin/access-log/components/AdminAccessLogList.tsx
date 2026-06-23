"use client";

import { useState } from "react";

import { AdminAccessLog } from "@/features/admin/access-log/type";
import AdminAccessLogItem from "./AdminAccessLogItem";

interface AdminAccessLogListProps {
    logs: AdminAccessLog[];
}

export default function AdminAccessLogList({ logs }: AdminAccessLogListProps) {
    const [expandedLogId, setExpandedLogId] = useState<number | null>(null);

    const toggleLog = (logId: number) => {
        setExpandedLogId((current) => current === logId ? null : logId);
    };

    return (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="grid min-w-[800px] grid-cols-[110px_150px_minmax(170px,1fr)_92px_140px_24px] gap-4 border-b border-slate-200 bg-slate-50 px-6 py-3 text-xs font-bold text-slate-500">
                <span>국가</span>
                <span>IP 주소</span>
                <span>접근 시도 일시</span>
                <span className="text-center">결과</span>
                <span className="text-right">접근 정보</span>
                <span aria-hidden />
            </div>

            <div className="divide-y divide-slate-100">
                {logs.map((log) => (
                    <AdminAccessLogItem
                        key={log.id}
                        log={log}
                        isExpanded={expandedLogId === log.id}
                        onToggle={() => toggleLog(log.id)}
                    />
                ))}
            </div>
        </section>
    );
}
