"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { AdminDashboardMonthlyDatum } from "./type";

interface AdminDashboardMonthlyBarChartProps {
    data: AdminDashboardMonthlyDatum[];
}

const SERIES = [
    {
        key: "totalUsers",
        label: "신규 회원 수",
        color: "#10b981",
        unit: "명",
    },
    {
        key: "totalLectures",
        label: "신규 강의 수",
        color: "#6366f1",
        unit: "개",
    },
    {
        key: "totalPosts",
        label: "신규 게시글 수",
        color: "#f59e0b",
        unit: "개",
    },
] as const;

const SERIES_META = SERIES.reduce<Record<string, { label: string; unit: string }>>((labels, series) => {
    labels[series.key] = {
        label: series.label,
        unit: series.unit,
    };
    return labels;
}, {});

export default function AdminDashboardMonthlyBarChart({
    data,
}: AdminDashboardMonthlyBarChartProps) {
    const year = new Date().getFullYear();
    const hasData = data.some((datum) =>
        (datum.totalLectures ?? 0) > 0 ||
        (datum.totalUsers ?? 0) > 0 ||
        (datum.totalPosts ?? 0) > 0
    );

    return (
        <section className="mb-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-base font-black text-slate-950">
                            올해 월별 신규 유입 지표
                        </h2>
                    </div>

                    <p className="mt-1 text-xs font-bold text-slate-400">
                        해당 월에 새로 생성된 회원, 강의, 게시글 수를 비교합니다.
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

            <div className="h-80">
                {hasData ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{
                                top: 8,
                                right: 8,
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
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                                tickFormatter={(value: number) => value.toLocaleString()}
                                width={58}
                            />
                            <Tooltip
                                cursor={{ fill: "rgb(241 245 249 / 0.72)" }}
                                contentStyle={{
                                    border: "1px solid #e2e8f0",
                                    borderRadius: 8,
                                    boxShadow: "0 10px 25px rgb(15 23 42 / 0.08)",
                                    fontSize: 12,
                                    fontWeight: 700,
                                }}
                                formatter={(value, name) => [
                                    value === null
                                        ? "-"
                                        : `${Number(value).toLocaleString()}${SERIES_META[String(name)]?.unit ?? ""}`,
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
                                <Bar
                                    key={series.key}
                                    dataKey={series.key}
                                    name={series.key}
                                    fill={series.color}
                                    radius={[4, 4, 0, 0]}
                                    barSize={18}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-full items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-50 text-sm font-bold text-slate-400">
                        해당 연도에 대한 데이터 집계가 존재하지 않습니다.
                    </div>
                )}
            </div>
        </section>
    );
}
