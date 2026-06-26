import { Building2, Sparkles } from "lucide-react";

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
        color: "bg-sky-50 text-sky-600 ring-sky-100",
    },
    {
        label: "BEAUTY",
        name: "뷰티",
        level: 3,
        color: "bg-pink-50 text-pink-600 ring-pink-100",
    },
    {
        label: "COOK",
        name: "요리",
        level: 3,
        color: "bg-amber-50 text-amber-600 ring-amber-100",
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
        <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 ring-1 ring-indigo-100">
                        <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-base font-black text-slate-900">
                            보유 건물 현황
                        </p>
                        <p className="mt-0.5 text-xs font-bold text-slate-400">
                            최대 레벨은 3단계입니다.
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-2 text-right ring-1 ring-slate-100">
                    <p className="text-[11px] font-black text-slate-400">
                        전체
                    </p>
                    <p className="text-xl font-black text-slate-900">
                        {data.buildings}개
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
                {buildingStats.map((building) => (
                    <div
                        key={building.label}
                        className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-center transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
                    >
                        <div className={`mx-auto mb-2 flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-[10px] font-black ring-1 ${building.color}`}>
                            {building.label}
                        </div>
                        <p className="text-sm font-black text-slate-800">
                            {building.name}
                        </p>
                        <p className="mt-1 flex items-center justify-center gap-1 text-[11px] font-bold text-slate-400">
                            <Sparkles className="h-3 w-3 text-indigo-300" />
                            Lv.{building.level}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
