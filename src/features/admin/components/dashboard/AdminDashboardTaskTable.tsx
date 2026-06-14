import { ChevronLeft, ChevronRight } from "lucide-react";

export interface AdminDashboardTask {
    id: number;
    type: "강사 승인" | "신고";
    title: string;
    requester: string;
    requestedAt: string;
    status: "대기" | "긴급";
}

const TYPE_CLASS = {
    "강사 승인": "bg-amber-50 text-amber-600",
    "신고": "bg-rose-50 text-rose-500",
};

const STATUS_CLASS = {
    "대기": "bg-amber-50 text-amber-600",
    "긴급": "bg-rose-50 text-rose-500",
};

const TASK_TABS = [
    { label: "전체", count: 11, active: true },
    { label: "강사 승인", count: 5, active: false },
    { label: "신고", count: 6, active: false },
];

// 처리 대기 작업은 목업 기준의 탭, 테이블, 페이지네이션 형태로 먼저 더미 구성했습니다.
export default function AdminDashboardTaskTable({
    tasks,
}: {
    tasks: AdminDashboardTask[];
}) {
    return (
        <div className="px-5 pb-4 pt-3">
            <div className="mb-3 flex items-center gap-7 border-b border-slate-100">
                {TASK_TABS.map((tab) => (
                    <button
                        key={tab.label}
                        type="button"
                        className={`relative h-9 text-xs font-black ${
                            tab.active ? "text-indigo-500" : "text-slate-500"
                        }`}
                    >
                        {tab.label}
                        <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-indigo-400">
                            {tab.count}
                        </span>

                        {tab.active && (
                            <span className="absolute bottom-[-1px] left-0 h-0.5 w-full rounded-full bg-indigo-400" />
                        )}
                    </button>
                ))}
            </div>

            <div className="overflow-hidden rounded-md border border-slate-100">
                <table className="w-full table-fixed text-left">
                    <thead className="bg-slate-50 text-xs font-black text-slate-600">
                        <tr>
                            <th className="w-24 px-4 py-3">구분</th>
                            <th className="px-4 py-3">제목</th>
                            <th className="w-28 px-4 py-3">요청자</th>
                            <th className="w-36 px-4 py-3">요청일</th>
                            <th className="w-20 px-4 py-3">상태</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-xs">
                        {tasks.map((task) => (
                            <tr key={task.id} className="text-slate-700">
                                <td className="px-4 py-3">
                                    <span className={`rounded-md px-2 py-1 font-black ${TYPE_CLASS[task.type]}`}>
                                        {task.type}
                                    </span>
                                </td>
                                <td className="truncate px-4 py-3 font-bold text-slate-800">
                                    {task.title}
                                </td>
                                <td className="px-4 py-3 font-semibold text-slate-500">
                                    {task.requester}
                                </td>
                                <td className="px-4 py-3 font-semibold text-slate-500">
                                    {task.requestedAt}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`rounded-md px-2 py-1 font-black ${STATUS_CLASS[task.status]}`}>
                                        {task.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">
                    전체 11건
                </span>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <button type="button" className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200">
                        <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" className="h-7 w-7 rounded-md border border-indigo-400 text-indigo-500">
                        1
                    </button>
                    <button type="button" className="h-7 w-7 rounded-md">
                        2
                    </button>
                    <button type="button" className="h-7 w-7 rounded-md">
                        3
                    </button>
                    <button type="button" className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200">
                        <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
