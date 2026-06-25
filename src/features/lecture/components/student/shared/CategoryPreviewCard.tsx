import Image from "next/image";

import { Category } from "@/features/lecture/type";
import getCategoryMeta from "@/features/lecture/components/student/shared/category";

interface CategoryPreviewCardProps {
    category?: string;
}

const CATEGORY_LABELS = [
    "학교",
    "피트니스센터",
    "식당",
    "백화점",
    "아트홀",
];

export default function CategoryPreviewCard({
    category,
}: CategoryPreviewCardProps) {
    if (!category) {
        return (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-bold text-slate-950">
                    건설 가능한 건물 목록
                </h2>

                <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
                    필터를 클릭하여 카테고리를 선택하면 어떤 건물을 세울 수 있는지 미리 볼 수 있습니다.
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm font-bold text-slate-600">
                    {CATEGORY_LABELS.map((label) => (
                        <span
                            key={label}
                            className="rounded-xl bg-slate-50 px-3 py-2"
                        >
                            {label}
                        </span>
                    ))}
                </div>
            </section>
        );
    }

    const categoryMeta = getCategoryMeta(category.toUpperCase() as Category);

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-950">
                건설 예정 건물
            </h2>

            <div className="mt-5">
                <p className="text-sm font-bold text-slate-950">
                    {categoryMeta.buildingName}
                </p>

                <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                    {categoryMeta.description}
                </p>
            </div>
        </section>
    );
}
