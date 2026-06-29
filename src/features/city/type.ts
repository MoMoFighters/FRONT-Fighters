import { StaticImageData } from "next/image";
import { Category } from "../lecture/type";

// 건물 정보에 대한 타입 정의
export interface Building {
    position: number;
    category: Category;
    level: number;
    // 임의로 로컬에 저장해놓고 사용, 실제로는 api 응답값에 넘어오는 url 사용
    // buildingUrl: string;
    buildingUrl: StaticImageData;
}

// 잔디 정보에 대한 타입 정의
export interface Streak {
    date: string;
    level: string;
}

export interface StreakRequest {
    year: number;
    month: number;
}

export interface StreakResponse {
    year: number;
    month: number;
    streaks: Streak[];
}
