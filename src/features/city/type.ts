import { Category } from "../lecture/type";

// 건물 정보에 대한 타입 정의
export interface Building {
    position: number;
    category: Category;
    level: number;
}

// 잔디 정보에 대한 타입 정의