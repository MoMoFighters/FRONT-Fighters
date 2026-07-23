import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import getCategoryMeta from "@/features/lecture/components/student/shared/category";
import { Category } from "@/features/lecture/type";
import createBuilding from "@/app/assets/img/createBuilding.png";

interface MobileBuildingItemProps {
    category?: Category;
    level?: number;
    buildingUrl?: string | StaticImageData;
    position?: number;
    interactive?: boolean;
}

export default function MobileBuildingItem({
    category,
    level,
    buildingUrl,
    position,
    interactive = true,
}: MobileBuildingItemProps) {
    const info = category && buildingUrl
        ? {
            ...getCategoryMeta(category),
            buildingImage: buildingUrl,
            href: `/student/${category.toLowerCase()}/lectures`,
        }
        : {
            label: "수강신청하기",
            buildingName: "건물 생성",
            description: "강의를 수강하고 건물을 성장시켜보세요.",
            buildingImage: createBuilding,
            href: `/student/lectures${position ? `?position=${position}` : ""}`,
        };

    const content = (
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-50">
                <Image
                    src={info.buildingImage}
                    alt={info.label}
                    fill
                    sizes="64px"
                    className="object-contain"
                />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <p className="font-black text-slate-900">
                        {info.buildingName}
                    </p>

                    {level ? (
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-500">
                            Lv.{level}
                        </span>
                    ) : null}
                </div>

                <p className="mt-1 text-xs font-medium text-slate-500">
                    {info.description}
                </p>
            </div>
        </div>
    );

    if (!interactive) {
        return content;
    }

    return (
        <Link href={info.href} className="block transition active:scale-[0.98]">
            {content}
        </Link>
    );
}
