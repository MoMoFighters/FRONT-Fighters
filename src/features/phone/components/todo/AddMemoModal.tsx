'use client'

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Check } from "lucide-react";
import { useEffect, useState } from "react";


export default function AddMemoModal({ setIsMemoModalOpen }: { setIsMemoModalOpen: (a: boolean) => void }) {

    const [endSelected, setEndSelected] = useState(false);
    const [date, setDate] = useState<string>("");
    const [dateRange, setDateRange] = useState<{ start: string; end: string; }>({ start: "", end: "", });
    useEffect(() => {
        console.log(date);
        console.log(dateRange)
    }, [date, dateRange])

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={() => setIsMemoModalOpen(false)}
        >
            <div
                className="w-90 rounded-2xl bg-white p-5 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-row justify-between items-center mb-2">

                    <h2 className="text-lg font-bold text-slate-900">
                        메모 추가하기
                    </h2>
                    <div
                        className="flex flex-row items-center gap-1 cursor-pointer"
                        onClick={() => setEndSelected(!endSelected)}
                    >
                        <p className="text-sm" style={{ userSelect: 'none' }}>종료일 선택</p>
                        <div
                            className="border border-black w-4 h-4"
                        >
                            {endSelected ? (<Check className="w-full h-full" />) : ("")}
                        </div>
                    </div>
                </div>
                <div className="flex flex-row justify-center">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {endSelected
                                    ? dateRange.start && dateRange.end
                                        ? `${dateRange.start} ~ ${dateRange.end}`
                                        : "기간 선택"
                                    : date || "날짜 선택"}
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto p-0">
                            {endSelected ? (
                                <Calendar
                                    mode="range"
                                    selected={{
                                        from: dateRange.start ? new Date(dateRange.start) : undefined,
                                        to: dateRange.end ? new Date(dateRange.end) : undefined,
                                    }}
                                    onSelect={(range) => {
                                        setDateRange({
                                            start: range?.from
                                                ? format(range.from, "yyyy-MM-dd")
                                                : "",
                                            end: range?.to
                                                ? format(range.to, "yyyy-MM-dd")
                                                : "",
                                        });
                                        console.log(range)
                                    }}
                                />
                            ) : (
                                <Calendar
                                    mode="single"
                                    selected={date ? new Date(date) : undefined}
                                    onSelect={(selectedDate) => {
                                        setDate(
                                            selectedDate
                                                ? format(selectedDate, "yyyy-MM-dd")
                                                : ""
                                        );
                                    }}
                                />
                            )}
                        </PopoverContent>
                    </Popover>
                </div>
                <textarea
                    className="mt-4 h-32 w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-indigo-300"
                    placeholder="메모를 입력하세요"
                />


                <div className="mt-4 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => setIsMemoModalOpen(false)}
                        className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500"
                    >
                        취소
                    </button>

                    <button
                        type="button"
                        className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-bold text-white"
                    // disabled={date !== "" || dateRange !== { start: "", end: "" }}
                    >
                        추가하기
                    </button>
                </div>
            </div>
        </div>
    );
}