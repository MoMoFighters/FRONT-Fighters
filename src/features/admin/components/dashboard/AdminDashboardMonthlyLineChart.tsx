"use client";

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

export interface AdminDashboardMonthlyDatum {
    month: string;
    totalLectures: number;
    totalUsers: number;
    totalPosts: number;
}

interface AdminDashboardMonthlyLineChartProps {
    data: AdminDashboardMonthlyDatum[];
    year: number;
}

const SERIES = [
    {
        key: "totalLectures",
        label: "총 강의수",
        color: "#6366f1",
        unit: "개",
        yAxisId: "right",
    },
    {
        key: "totalUsers",
        label: "총 회원수",
        color: "#10b981",
        unit: "명",
        yAxisId: "left",
    },
    {
        key: "totalPosts",
        label: "총 게시글 수",
        color: "#f59e0b",
        unit: "개",
        yAxisId: "right",
    },
] as const;

const SERIES_META = SERIES.reduce<Record<string, { label: string; unit: string }>>((labels, series) => {
    labels[series.key] = {
        label: series.label,
        unit: series.unit,
    };
    return labels;
}, {});

export default function AdminDashboardMonthlyLineChart({
    data,
    year,
}: AdminDashboardMonthlyLineChartProps) {
    return (
        <section className="mb-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-6">
                <div>
                    <h2 className="text-base font-black text-slate-950">
                        {year}년 월별 운영 추이
                    </h2>
                    <p className="mt-1 text-xs font-bold text-slate-400">
                        총 강의수, 총 회원수, 총 게시글 수를 한 그래프에서 비교합니다.
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-4">
                    {SERIES.map((series) => (
                        <div
                            key={series.key}
                            className="flex items-center gap-2 text-xs font-bold text-slate-500"
                        >
                            <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: series.color }}
                            />
                            {series.label}
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{
                            top: 8,
                            right: 12,
                            bottom: 0,
                            left: 0,
                        }}
                    >
                        <CartesianGrid
                            stroke="#e2e8f0"
                            strokeDasharray="4 4"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                            dy={10}
                        />
                        <YAxis
                            yAxisId="left"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                            tickFormatter={(value: number) => value.toLocaleString()}
                            width={58}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                            tickFormatter={(value: number) => value.toLocaleString()}
                            width={54}
                        />
                        <Tooltip
                            cursor={{ stroke: "#cbd5e1", strokeDasharray: "4 4" }}
                            contentStyle={{
                                border: "1px solid #e2e8f0",
                                borderRadius: 8,
                                boxShadow: "0 10px 25px rgb(15 23 42 / 0.08)",
                                fontSize: 12,
                                fontWeight: 700,
                            }}
                            formatter={(value, name) => [
                                `${Number(value).toLocaleString()}${SERIES_META[String(name)]?.unit ?? ""}`,
                                SERIES_META[String(name)]?.label ?? name,
                            ]}
                            labelFormatter={(label) => `${year}년 ${label}`}
                            labelStyle={{
                                color: "#0f172a",
                                fontWeight: 900,
                                marginBottom: 6,
                            }}
                        />
                        {SERIES.map((series) => (
                            <Line
                                key={series.key}
                                type="monotone"
                                dataKey={series.key}
                                yAxisId={series.yAxisId}
                                stroke={series.color}
                                strokeWidth={3}
                                dot={{
                                    r: 3,
                                    strokeWidth: 2,
                                    fill: "#ffffff",
                                }}
                                activeDot={{
                                    r: 5,
                                    strokeWidth: 2,
                                }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}
