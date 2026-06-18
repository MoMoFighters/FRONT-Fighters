import { StaticImageData } from "next/image";

import { Category } from "../../../type";
import STUDY from "@/app/assets/img/STUDY.png";
import ART from "@/app/assets/img/ART.png";
import COOK from "@/app/assets/img/COOK2.png";
import HEALTH from "@/app/assets/img/health.png";
import BEAUTY from "@/app/assets/img/BEAUTY1.png";
import school from "@/app/assets/img/school.png";
import arthall from "@/app/assets/img/arthall.png";
import health from "@/app/assets/img/health.png";
import cook from "@/app/assets/img/cook.png";
import beauty from "@/app/assets/img/beauty.png";

export interface CategoryMeta {
    label: string;
    buildingName: string;
    description: string;
    buildingImage: StaticImageData;
    backgroundImage: StaticImageData;
}

export default function getCategoryMeta(category: Category): CategoryMeta {
    switch (category) {
        case "STUDY":
            return {
                label: "학습",
                buildingName: "학교",
                description: "학습 카테고리 관련 강의를 수강할 수 있습니다.",
                buildingImage: school,
                backgroundImage: STUDY,
            };

        case "FITNESS":
            return {
                label: "운동",
                buildingName: "피트니스센터",
                description: "운동(헬스, 스포츠 등) 카테고리 관련 강의를 수강할 수 있습니다.",
                buildingImage: health,
                backgroundImage: HEALTH,
            };

        case "COOK":
            return {
                label: "요리",
                buildingName: "식당",
                description: "요리 카테고리 관련 강의를 수강할 수 있습니다.",
                buildingImage: cook,
                backgroundImage: COOK,
            };

        case "BEAUTY":
            return {
                label: "뷰티",
                buildingName: "백화점",
                description: "뷰티(패션, 화장 등) 카테고리 관련 강의를 수강할 수 있습니다.",
                buildingImage: beauty,
                backgroundImage: BEAUTY,
            };

        case "ART":
            return {
                label: "예술",
                buildingName: "아트홀",
                description: "예술(음악, 미술 등) 카테고리 관련 강의를 수강할 수 있습니다.",
                buildingImage: arthall,
                backgroundImage: ART,
            };
    }
}
