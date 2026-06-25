import { Building2, ChevronRight } from "lucide-react";

interface MyBuildingInfoProps {
    data: {
        buildings: number;
    }
}

const buildingStats = [
    {
        label: "FITNESS",
        name: "피트니스",
        level: 1,
        color: "bg-cyan-50 text-cyan-600 ring-cyan-100",
    },
    {
        label: "BEAUTY",
        name: "뷰티",
        level: 3,
        color: "bg-fuchsia-50 text-fuchsia-600 ring-fuchsia-100",
    },
    {
        label: "COOK",
        name: "요리",
        level: 3,
        color: "bg-orange-50 text-orange-600 ring-orange-100",
    },
    {
        label: "STUDY",
        name: "학습",
        level: 2,
        color: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    },
    {
        label: "ART",
        name: "예술",
        level: 2,
        color: "bg-violet-50 text-violet-600 ring-violet-100",
    },
];

export default function MyBuildingInfo({ data }: MyBuildingInfoProps) {
    return (
        <section className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-white text-indigo-500 shadow-sm ring-1 ring-slate-100">
                        <Building2 className="h-5 w-5" />
                    </div>

                    <div>
                        <p className="text-sm font-black text-slate-900">
                            보유 건물 현황
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-slate-400">
                            현재 도시의 카테고리 건물
                        </p>
                    </div>
                </div>

                <div className="flex items-end gap-1">
                    <span className="text-2xl font-black leading-none text-slate-900">
                        {data.buildings}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                        개
                    </span>
                </div>
            </div>

            <div className="divide-y divide-slate-100">
                {buildingStats.map((building) => (
                    <div
                        key={building.label}
                        className="flex items-center justify-between px-5 py-2.5 transition hover:bg-slate-50"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <span className={`flex h-7 min-w-16 items-center justify-center rounded-full px-2 text-[11px] font-black ring-1 ${building.color}`}>
                                {building.label}
                            </span>

                            <div className="min-w-0">
                                <p className="text-sm font-black text-slate-800">
                                    {building.name}
                                </p>
                                <p className="text-[11px] font-bold text-slate-400">
                                    Level {building.level} / 3
                                </p>
                            </div>
                        </div>

                        <ChevronRight className="h-4 w-4 text-slate-300" />
                    </div>
                ))}
            </div>
        </section>
    );
}
