import Image, { StaticImageData } from "next/image";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import Link from "next/link";
import getCategoryMeta from "@/features/lecture/components/student/shared/category";
import { Category } from "@/features/lecture/type";

import mypage from "@/app/assets/img/mypage.png";
import point from "@/app/assets/img/point.png";
import createBuilding from "@/app/assets/img/createBuilding.png"

type CommonBuilding = "mypage" | "point";

interface BuildingItemProps {
    common?: CommonBuilding,
    category?: Category,
    level?: number,
    buildingUrl?: string | StaticImageData
    position?: number
    priority?: boolean
    imageSizes?: string
}

export default function BuildingItem({
    common,
    category,
    level,
    buildingUrl,
    position,
    priority = false,
    imageSizes = "(max-width: 768px) 18vw, 13vw",
}: BuildingItemProps) {

    const getBuildingInfo = () => {
        if (common && common === "mypage") {
            return {
                label: "마이페이지",
                buildingName: "집",
                description: "마이페이지로 이동합니다.",
                buildingImage: mypage,
                href: "/student/mypage"
            }
        }

        if (common && common === "point") {
            return {
                label: "포인트상점",
                buildingName: "포인트상점",
                description: "포인트 상점으로 이동합니다.",
                buildingImage: point,
                href: "/student/point-store"
            }
        }

        if (category && buildingUrl) {
            return {
                ...getCategoryMeta(category),
                buildingImage: buildingUrl,
                href: `/student/${category.toLowerCase()}/lectures`
            }
        }

        return {
            label: "수강신청하기",
            buildingName: "건물 생성",
            description: "강의를 수강하고 건물을 성장시켜보세요.",
            buildingImage: createBuilding,
            href: `/student/lectures${position ? `?position=${position}` : ""}`
        }
    }

    const buildingInfo = getBuildingInfo();

    return (
        <HoverCard openDelay={50} closeDelay={50}>
            <HoverCardTrigger asChild>
                <Link href={buildingInfo.href} className="relative block w-full h-full hover:scale-110 transition-all">
                    <Image
                        src={buildingInfo.buildingImage}
                        alt={buildingInfo.label}
                        fill
                        sizes={imageSizes}
                        priority={priority}
                        className="object-contain"
                    />


                </Link>
            </HoverCardTrigger>
            <HoverCardContent className="flex w-64 flex-col gap-0.5" side="bottom">
                <div className="font-semibold text-slate-700 text-[14px]">{buildingInfo.buildingName} {level ? `Lv.${level}` : ""}</div>
                <div className="text-slate-500 text-[12px]">{buildingInfo.description}</div>
            </HoverCardContent>
        </HoverCard>

    );
}
