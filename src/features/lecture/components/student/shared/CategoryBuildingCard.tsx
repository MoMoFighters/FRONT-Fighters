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
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm [container-type:inline-size]">
            <h2 className="text-[clamp(0.9375rem,4cqw,1rem)] font-bold text-slate-950">
                나의 MoMoCITY
            </h2>

            <div className="relative mx-auto mt-4 flex h-[clamp(6rem,45cqw,10rem)] w-[clamp(6rem,45cqw,10rem)] items-center justify-center rounded-2xl bg-slate-50 text-[clamp(0.8125rem,3cqw,0.875rem)] font-bold text-slate-400">
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
                <p className="text-[clamp(0.8125rem,3.5cqw,0.875rem)] font-bold text-slate-950">
                    {buildingName} 성장 현황
                </p>

                <div className="mt-4 flex items-center justify-between">
                    <span className="text-[clamp(0.8125rem,3.5cqw,0.875rem)] font-bold text-indigo-500">
                        Lv. {level}
                    </span>

                    <span className="text-[clamp(0.75rem,3cqw,0.75rem)] font-medium text-slate-500">
                        {currentExp} / {maxExp} XP
                    </span>
                </div>

                <Progress value={Math.round((currentExp / maxExp) * 100)} className="mt-2" />
            </div>

            <Link
                href={'/student/'}
                className="mt-6 flex h-[clamp(2.25rem,10cqw,3rem)] items-center justify-center rounded-xl border border-indigo-300 text-[clamp(0.8125rem,3.5cqw,0.875rem)] font-bold text-indigo-500 transition hover:bg-indigo-50"
            >
                도시로 돌아가기
            </Link>
        </section>
    );
}
