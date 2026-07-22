"use client";

import { useState } from "react";

import { AccessLog } from "@/features/admin/access-log/type";
import AdminAccessLogItem from "./AdminAccessLogItem";

interface AdminAccessLogListProps {
    logs: AccessLog[];
}

export default function AdminAccessLogList({ logs }: AdminAccessLogListProps) {
    const [expandedLogId, setExpandedLogId] = useState<number | null>(null);

    const toggleLog = (logId: number) => {
        setExpandedLogId((current) => current === logId ? null : logId);
    };

    return (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="hidden gap-4 border-b border-slate-200 bg-slate-50 px-6 py-3 text-xs font-bold text-slate-500 md:grid md:min-w-[800px] md:grid-cols-[110px_150px_minmax(170px,1fr)_92px_140px_24px]">
                <span>시도 방법</span>
                <span>IP 주소</span>
                <span>접근 시도 일시</span>
                <span className="text-center">결과</span>
                <span className="text-right">접근 정보</span>
                <span aria-hidden />
            </div>

            {logs.length === 0 ? (
                <div className="flex h-64 items-center justify-center text-sm font-bold text-slate-400">
                    조회할 접근 로그가 없습니다.
                </div>
            ) : (
                <div className="divide-y divide-slate-100">
                    {logs.map((log) => (
                        <AdminAccessLogItem
                            key={log.logId}
                            log={log}
                            isExpanded={expandedLogId === log.logId}
                            onToggle={() => toggleLog(log.logId)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
