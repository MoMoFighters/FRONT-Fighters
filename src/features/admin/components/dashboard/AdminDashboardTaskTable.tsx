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

// 처리 대기 작업은 대시보드에서 최신순으로 받은 일부 항목만 미리보기로 노출합니다.
export default function AdminDashboardTaskTable({
    tasks,
}: {
    tasks: AdminDashboardTask[];
}) {
    return (
        <div className="px-5 pb-5 pt-4">
            <div className="overflow-hidden rounded-md border border-slate-100">
                <table className="w-full table-fixed text-left">
                    <thead className="bg-slate-50 text-xs font-black text-slate-600">
                        <tr>
                            <th className="w-24 px-4 py-3">구분</th>
                            <th className="px-4 py-3">제목</th>
                            <th className="w-28 px-4 py-3">요청자</th>
                            <th className="w-36 px-4 py-3">요청일</th>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
