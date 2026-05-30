interface MyInfoTableProps {
    data: {
        email: string;
        points: number;
        buildings: number;
    }
}

export default function MyInfoTable({ data }: MyInfoTableProps) {
    return (
        <div className="grid grid-rows-3 mt-4 rounded-md overflow-hidden border border-slate-300">
            <div className="flex flex-row border-b border-slate-300">
                <div className="flex items-center w-26 p-3 bg-slate-100 border-r border-slate-300">
                    <p className="my-auto text-slate-500">이메일</p>
                </div>
                <div className="flex-1 flex items-center w-26 p-3 font-semibold bg-slate-50">
                    <p className="my-auto text-slate-900">{data.email}</p>
                </div>
            </div>
            <div className="flex flex-row border-b border-slate-300">
                <div className="flex items-center w-26 p-3 bg-slate-100 border-r border-slate-300">
                    <p className="my-auto text-slate-500">보유 포인트</p>
                </div>
                <div className="flex-1 flex items-center w-26 p-3 font-semibold bg-slate-50">
                    <p className="my-auto text-slate-900">{data.points.toLocaleString()} P</p>
                </div>
            </div>
            <div className="flex flex-row">
                <div className="flex items-center w-26 p-3 bg-slate-100 border-r border-slate-300">
                    <p className="my-auto text-slate-500">보유 건물</p>
                </div>
                <div className="flex-1 flex items-center w-26 p-3 font-semibold bg-slate-50">
                    <p className="my-auto text-slate-900">{data.buildings} 개</p>
                </div>
            </div>
        </div>
    );
}