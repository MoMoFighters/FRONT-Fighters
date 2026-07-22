import type { Streak } from "./type";
import type { GrassLevel } from "@/components/mypage/GrassHeatmap";

// "LEVEL0" ~ "LEVEL4" 형태의 문자열에서 레벨 숫자만 추출
// (components/city/MonthlyStreakGarden.tsx의 normalizeLevel과 동일한 파싱 로직)
export const parseStreakLevel = (level: string | number | undefined): GrassLevel => {
    const parsed =
        typeof level === "string" ? Number(level.replace(/\D/g, "")) : Number(level ?? 0);

    return parsed >= 0 && parsed <= 4 ? (parsed as GrassLevel) : 0;
};

// 연간 활동 잔디 배열을 날짜(YYYY-MM-DD)를 key로 하는 조회용 객체로 변환
export const buildActivityGrassMap = (
    streaks: Streak[] | null | undefined
): Record<string, GrassLevel> => {
    const map: Record<string, GrassLevel> = {};

    if (!Array.isArray(streaks)) {
        return map;
    }

    for (const streak of streaks) {
        map[streak.streakDate.slice(0, 10)] = parseStreakLevel(streak.level);
    }

    return map;
};
