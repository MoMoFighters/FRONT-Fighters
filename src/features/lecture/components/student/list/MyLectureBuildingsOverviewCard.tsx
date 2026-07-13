import Link from "next/link";

import { Category } from "@/features/lecture/type";
import getCategoryMeta from "@/features/lecture/components/student/shared/category";

const CATEGORIES: Category[] = [
    "STUDY",
    "FITNESS",
    "COOK",
    "BEAUTY",
    "ART",
];

export default function MyLectureBuildingsOverviewCard() {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-950">
                나의 학습 건물
            </h2>

            <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
                카테고리를 선택하면 해당 분야에서 수강 중인 강의를 모아볼 수 있습니다.
            </p>

            <div className="mt-5 space-y-3">
                {CATEGORIES.map((category) => {
                    const categoryMeta = getCategoryMeta(category);
                    const categorySlug = category.toLowerCase();

                    return (
                        <Link
                            key={category}
                            href={`/student/mypage/lectures?category=${categorySlug}`}
                            className="block rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:border-indigo-200 hover:bg-indigo-50"
                        >
                            <p className="text-sm font-bold text-slate-950">
                                {categoryMeta.buildingName}
                            </p>

                            <p className="mt-1 text-xs font-bold text-slate-500">
                                {categoryMeta.label} 강의 보기
                            </p>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
