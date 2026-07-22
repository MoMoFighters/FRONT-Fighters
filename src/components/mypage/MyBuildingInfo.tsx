import { BuildingInfo } from "@/app/services/user/service";
import { Building2 } from "lucide-react";

const CATEGORY_META: Record<
    BuildingInfo["category"],
    {
        label: string;
        color: string;
    }
> = {
    STUDY: {
        label: "STUDY",
        color: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    FITNESS: {
        label: "FITNESS",
        color: "border-cyan-200 bg-cyan-50 text-cyan-700",
    },
    COOK: {
        label: "COOK",
        color: "border-orange-200 bg-orange-50 text-orange-700",
    },
    BEAUTY: {
        label: "BEAUTY",
        color: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
    },
    ART: {
        label: "ART",
        color: "border-violet-200 bg-violet-50 text-violet-700",
    },
};

interface MyBuildingInfoProps {
    data: BuildingInfo[];
}

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
                            현재 도시에 배치된 건물 정보입니다.
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-2 text-right ring-1 ring-slate-100">
                    <p className="text-[11px] font-black text-slate-400">
                        전체
                    </p>
                    <p className="text-xl font-black text-slate-900">
                        {data.length}개
                    </p>
                </div>
            </div>

            {data.length === 0 ? (
                <div className="flex h-30 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 text-sm font-bold text-slate-400">
                    아직 보유한 건물이 없습니다.
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                    {data.map((building) => {
                        const meta = CATEGORY_META[building.category];

                        return (
                            <div
                                key={`${building.category}-${building.position}`}
                                className={`rounded-2xl border p-3 text-center transition hover:-translate-y-0.5 hover:shadow-sm ${meta.color}`}
                            >
                                <p className="truncate text-[11px] font-black">
                                    {meta.label}
                                </p>
                                <p className="mt-1 text-sm font-black">
                                    Lv.{building.level}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
