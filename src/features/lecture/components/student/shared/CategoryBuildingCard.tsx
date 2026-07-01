import Image from "next/image";
import Link from "next/link";

import { Progress } from "@/components/ui/progress";

interface CategoryBuildingCardProps {
    category: string;
    buildingName: string;
    buildingImage?: string;
    level: number;
    currentExp: number;
    maxExp: number;
}

export default function CategoryBuildingCard({
    category,
    buildingName,
    buildingImage,
    level,
    currentExp,
    maxExp,
}: CategoryBuildingCardProps) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-950">
                나의 MoMoCITY
            </h2>

            <div className="relative mx-auto mt-4 flex h-40 w-40 items-center justify-center rounded-2xl bg-slate-50 text-sm font-bold text-slate-400">
                {buildingImage ? (
                    <Image
                        src={buildingImage}
                        alt={`${buildingName} 이미지`}
                        fill
                        sizes="160px"
                        className="object-contain"
                    />
                ) : (
                    "이미지 없음"
                )}
            </div>

            <div className="mt-5">
                <p className="text-sm font-bold text-slate-950">
                    {buildingName} 성장 현황
                </p>

                <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-indigo-500">
                        Lv. {level}
                    </span>

                    <span className="text-xs font-medium text-slate-500">
                        {currentExp} / {maxExp} XP
                    </span>
                </div>

                <Progress value={Math.round((currentExp / maxExp) * 100)} className="mt-2" />
            </div>

            <Link
                href={'/student/'}
                className="mt-6 flex h-12 items-center justify-center rounded-xl border border-indigo-300 text-sm font-bold text-indigo-500 transition hover:bg-indigo-50"
            >
                도시로 돌아가기
            </Link>
        </section>
    );
}
