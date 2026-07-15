"use client";

import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { AdminDashboardMonthlyRevenueDatum } from "./type";

interface AdminDashboardMonthlyRevenueChartProps {
    data: AdminDashboardMonthlyRevenueDatum[];
}

const MEMBERSHIP_SERIES = [
    { key: "basic", label: "BASIC", color: "#94a3b8" },
    { key: "plus", label: "PLUS", color: "#6366f1" },
    { key: "pro", label: "PRO", color: "#8b5cf6" },
] as const;

const SALES_COLOR = "#f43f5e";

const SERIES_META: Record<string, { label: string; unit: string }> = {
    basic: { label: "BASIC 가입자 수", unit: "명" },
    plus: { label: "PLUS 가입자 수", unit: "명" },
    pro: { label: "PRO 가입자 수", unit: "명" },
    sales: { label: "총 매출", unit: "원" },
};

export default function AdminDashboardMonthlyRevenueChart({
    data,
}: AdminDashboardMonthlyRevenueChartProps) {
    const year = new Date().getFullYear();
    const hasData = data.some((datum) =>
        (datum.basic ?? 0) > 0 ||
        (datum.plus ?? 0) > 0 ||
        (datum.pro ?? 0) > 0 ||
        (datum.sales ?? 0) > 0
    );

    return (
        <section className="mb-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-6">
                <div>
                    <h2 className="text-base font-black text-slate-950">
                        올해 월별 매출·멤버십 분포
                    </h2>

                    <p className="mt-1 text-xs font-bold text-slate-400">
                        월별 멤버십 등급 가입 현황과 총 매출 추이를 함께 비교합니다.
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-4">
                    {MEMBERSHIP_SERIES.map((series) => (
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

                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: SALES_COLOR }}
                        />
                        총 매출
                    </div>
                </div>
            </div>

            <div className="h-80">
                {hasData ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={data}
                            margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
                        >
                            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
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
                                width={54}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                                tickFormatter={(value: number) => `${(value / 10000).toLocaleString()}만`}
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
                                labelStyle={{ color: "#0f172a", fontWeight: 900, marginBottom: 6 }}
                            />
                            {MEMBERSHIP_SERIES.map((series) => (
                                <Bar
                                    key={series.key}
                                    yAxisId="left"
                                    dataKey={series.key}
                                    name={series.key}
                                    fill={series.color}
                                    radius={[4, 4, 0, 0]}
                                    barSize={14}
                                />
                            ))}
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="sales"
                                name="sales"
                                stroke={SALES_COLOR}
                                strokeWidth={3}
                                connectNulls={false}
                                dot={{ r: 3, strokeWidth: 2, fill: "#ffffff" }}
                                activeDot={{ r: 5, strokeWidth: 2 }}
                            />
                        </ComposedChart>
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
