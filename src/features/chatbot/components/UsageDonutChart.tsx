"use client";

import { Cell, Pie, PieChart } from "recharts";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import type { ChatUsageInfo } from "../type";

interface UsageDonutChartProps {
    usage: ChatUsageInfo;
}

export default function UsageDonutChart({ usage }: UsageDonutChartProps) {
    const { modelName, dailyLimit, dailyUsed, usagePercentage } = usage;
    const remaining = Math.max(dailyLimit - dailyUsed, 0);
    const percentage = Math.min(100, Math.max(0, Math.round(usagePercentage)));
    const remainingPercentage = 100 - percentage;

    const data = [{ value: dailyUsed }, { value: remaining }];

    return (
        <HoverCard openDelay={100}>
            <HoverCardTrigger asChild>
                <div className="flex cursor-default items-center gap-1.5">
                    <PieChart width={20} height={20}>
                        <Pie
                            data={data}
                            dataKey="value"
                            innerRadius={6}
                            outerRadius={10}
                            startAngle={90}
                            endAngle={-270}
                            stroke="none"
                        >
                            <Cell fill="#6366f1" />
                            <Cell fill="#e2e8f0" />
                        </Pie>
                    </PieChart>
                    <div>
                        <p className="text-[10px] leading-tight text-slate-600">{modelName}</p>
                        <p className="text-[9px] leading-tight text-slate-400">
                            남은 세션 사용량 {remainingPercentage}%
                        </p>
                    </div>
                </div>
            </HoverCardTrigger>

            <HoverCardContent side="top" className="w-56 space-y-2">
                <p className="text-sm font-medium">모델명 : {modelName}</p>
                <p className="text-sm">오늘 사용량 : {percentage}%</p>
                <Progress value={percentage} />
            </HoverCardContent>
        </HoverCard>
    );
}
