import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { formatStudyTime } from "@/features/study/utils";

interface WeeklyRecord {
    date: string;
    totalSeconds: number;
}

interface StudyWeeklyChartProps {
    records: WeeklyRecord[];
}

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

// "YYYY-MM-DD" 문자열을 UTC 변환 없이 로컬 날짜로 파싱 (요일 계산이 하루 밀리지 않도록)
const parseLocalDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
};

const formatDateLabel = (date: Date) => `${date.getMonth() + 1}월 ${date.getDate()}일`;

export default function StudyWeeklyChart({ records }: StudyWeeklyChartProps) {
    const maxSeconds = Math.max(...records.map((record) => record.totalSeconds), 1);
    const todayIndex = records.length - 1;

    return (
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-black text-slate-900">최근 7일 공부량</p>

            <div className="mt-4 flex items-end justify-between gap-2">
                {records.map((record, index) => {
                    const parsedDate = parseLocalDate(record.date);
                    const weekdayLabel = WEEKDAY_LABELS[parsedDate.getDay()];
                    const isToday = index === todayIndex;
                    const heightPercent = Math.max((record.totalSeconds / maxSeconds) * 100, 4);

                    return (
                        <div key={record.date} className="flex flex-1 flex-col items-center gap-1.5">
                            <HoverCard openDelay={100} closeDelay={0}>
                                <HoverCardTrigger asChild>
                                    <div className="flex h-20 w-full cursor-default items-end justify-center">
                                        <div
                                            className={`w-full max-w-6 rounded-t-md transition-colors ${
                                                isToday
                                                    ? "bg-amber-400"
                                                    : record.totalSeconds > 0
                                                        ? "bg-indigo-400"
                                                        : "bg-slate-100"
                                            }`}
                                            style={{ height: `${heightPercent}%` }}
                                        />
                                    </div>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-auto text-center">
                                    <p className="text-xs font-black text-slate-900">
                                        {formatDateLabel(parsedDate)} ({weekdayLabel})
                                        {isToday && (
                                            <span className="ml-1 font-black text-amber-500">
                                                · 오늘
                                            </span>
                                        )}
                                    </p>
                                    <p className="mt-1 font-mono text-sm font-bold text-indigo-500">
                                        {formatStudyTime(record.totalSeconds)}
                                    </p>
                                </HoverCardContent>
                            </HoverCard>
                            <span
                                className={`text-[11px] font-bold ${
                                    isToday ? "text-amber-500" : "text-slate-400"
                                }`}
                            >
                                {weekdayLabel}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
