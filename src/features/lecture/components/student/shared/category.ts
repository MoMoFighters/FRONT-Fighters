import { StaticImageData } from "next/image";

import { Category } from "../../../type";
import school from "@/app/assets/img/school.png";
import arthall from "@/app/assets/img/arts.png";
import health from "@/app/assets/img/health.png";
import cook from "@/app/assets/img/cook.png";
import beauty from "@/app/assets/img/beauty.png";

export interface CategoryMeta {
    label: string;
    buildingName: string;
    description: string;
    buildingImage: StaticImageData;
}

export default function getCategoryMeta(category: Category): CategoryMeta {
    switch (category) {
        case "STUDY":
            return {
                label: "학습",
                buildingName: "학교",
                description: "학습 카테고리 관련 강의를 수강할 수 있습니다.",
                buildingImage: school,
            };

        case "FITNESS":
            return {
                label: "운동",
                buildingName: "피트니스센터",
                description: "운동 카테고리 관련 강의를 수강할 수 있습니다.",
                buildingImage: health,
            };

        case "COOK":
            return {
                label: "요리",
                buildingName: "요리 학원",
                description: "요리 카테고리 관련 강의를 수강할 수 있습니다.",
                buildingImage: cook,
            };

        case "BEAUTY":
            return {
                label: "뷰티",
                buildingName: "백화점",
                description: "뷰티 카테고리 관련 강의를 수강할 수 있습니다.",
                buildingImage: beauty,
            };

        case "ART":
            return {
                label: "예술",
                buildingName: "아트홀",
                description: "예술 카테고리 관련 강의를 수강할 수 있습니다.",
                buildingImage: arthall,
            };
    }
}
