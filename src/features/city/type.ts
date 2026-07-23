import { Category } from "../lecture/type";

export interface Building {
    position: number;
    category: Category;
    level: number;
    buildingUrl: string;
}

export interface FriendBuildingsResponse {
    nickname: string;
    buildings: Building[];
}

export interface Streak {
    streakDate: string;
    level: string;
}

export interface StreakResponse {
    streaks: Streak[];
}

export type FortuneTone = "GOOD" | "NEUTRAL" | "BAD";

export interface Fortune {
    fortuneId: number;
    content: string;
    tone: FortuneTone;
    drawnDate: string;
}
