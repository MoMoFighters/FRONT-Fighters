import { Category } from "../lecture/type";

// 건물 정보에 대한 타입 정의
export interface Building {
    position: number;
    category: Category;
    level: number;
    buildingUrl: string;
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
