"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

import { AdminAccessLog, AccessLogRole } from "@/features/admin/access-log/type";

const ROLE_LABEL: Record<AccessLogRole, string> = {
    STUDENT: "수강생",
    TEACHER: "강사",
    ADMIN: "관리자",
};

interface AdminAccessLogItemProps {
    log: AdminAccessLog;
    isExpanded: boolean;
    onToggle: () => void;
}

export default function AdminAccessLogItem({
    log,
    isExpanded,
    onToggle,
}: AdminAccessLogItemProps) {
    return (
        <article>
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isExpanded}
                className="grid w-full grid-cols-[110px_150px_minmax(170px,1fr)_92px_140px_24px] items-center gap-4 px-6 py-4 text-left text-sm transition-colors hover:bg-slate-50"
            >
                <span className="font-medium text-slate-600">{log.country}</span>
                <span className="font-medium text-slate-600">{log.ipAddress}</span>
                <time className="text-slate-500">{log.accessedAt}</time>
                <span className={log.isSuccess
                    ? "justify-self-center rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700"
                    : "justify-self-center rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-600"
                }>
                    {log.isSuccess ? "성공" : "실패"}
                </span>
                <span className="text-right font-medium text-slate-500">
                    {log.user ? "회원 접근" : "외부 접근"}
                </span>
                {isExpanded
                    ? <ChevronUp className="size-4 text-slate-400" />
                    : <ChevronDown className="size-4 text-slate-400" />
                }
            </button>

            {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
                    {log.user ? (
                        <div className="border-l-2 border-indigo-400 pl-4">
                            <div className="grid max-w-xl grid-cols-2 gap-x-10 gap-y-1 text-sm">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400">접근 사용자</p>
                                    <p className="mt-1 font-bold text-slate-700">{log.user.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400">사용자 유형</p>
                                    <p className="mt-1 font-bold text-slate-700">{ROLE_LABEL[log.user.role]}</p>
                                </div>
                            </div>
                            <p className="mt-3 text-sm text-slate-500">회원 계정으로 접근한 기록입니다.</p>
                        </div>
                    ) : (
                        <div className="border-l-2 border-slate-300 pl-4 text-sm text-slate-500">
                            외부에서 접근한 기록입니다.
                        </div>
                    )}
                </div>
            )}
        </article>
    );
}
