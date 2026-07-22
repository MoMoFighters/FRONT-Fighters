import { Category } from "../lecture/type";

export interface Building {
    position: number;
    category: Category;
    level: number;
    buildingUrl: string;
}

export interface Streak {
    streakDate: string;
    level: string;
}

export interface StreakResponse {
    streaks: Streak[];
}
