import Image from "next/image";
import Link from "next/link";

import { CategoryUrl } from "@/features/lecture/type";
import getCategoryMeta from "@/features/lecture/components/student/category";

const CATEGORIES: CategoryUrl[] = [
    "study",
    "fitness",
    "cook",
    "beauty",
    "art",
];

export default function MyLectureBuildingsOverviewCard() {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-950">
                나의 학습 건물
            </h2>

            <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
                수강 중인 강의는 각 카테고리 건물의 성장으로 이어집니다.
                카테고리를 선택하면 건물별 학습 현황을 자세히 볼 수 있습니다.
            </p>

            <div className="mt-5 space-y-3">
                {CATEGORIES.map((category) => {
                    const categoryMeta = getCategoryMeta(category);

                    return (
                        <Link
                            key={category}
                            href={`/student/mypage/lectures?category=${category}`}
                            className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:border-indigo-200 hover:bg-indigo-50"
                        >
                            <div className="relative h-12 w-12 shrink-0">
                                <Image
                                    src={categoryMeta.buildingImage}
                                    alt={`${categoryMeta.buildingName} 이미지`}
                                    fill
                                    sizes="48px"
                                    className="object-contain"
                                />
                            </div>

                            <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-950">
                                    {categoryMeta.buildingName}
                                </p>

                                <p className="mt-1 text-xs font-semibold text-slate-500">
                                    {categoryMeta.label} 강의 보기
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
