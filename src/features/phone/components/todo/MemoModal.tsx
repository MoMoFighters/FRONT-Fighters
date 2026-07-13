'use client'

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { addDateMemoAction, addDateRangeMemoAction, deleteMemoAction, editDateMemoAction, editDateRangeMemoAction } from "@/features/calendar/action";
import DeleteModal from "@/features/modal/DeleteModal";
import { format } from "date-fns";
import { CalendarIcon, Check, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";


export default function AddMemoModal({ setIsMemoModalOpen, createMemo, onChanged, data }:
    {
        setIsMemoModalOpen: (a: boolean) => void,
        createMemo: boolean
        onChanged?: (date: string) => void | Promise<void>
        data?: {
            id: number;
            title: string;
            start: string;
            end?: string | undefined;
        }
    }
) {

    const [endSelected, setEndSelected] = useState(!createMemo && data?.end && true || false);
    const [date, setDate] = useState<string>(data?.start || "");
    const [dateRange, setDateRange] =
        useState<{ start: string; end: string; }>({ start: data?.start || "", end: data?.end || "", });
    const [title, setTitle] = useState(createMemo ? "" : data?.title || "");
    const [isSending, setIsSending] = useState(false);

    const disabled =
        title.trim() === "" ||
        (endSelected
            ? (
                dateRange.start === "" ||
                dateRange.end === "" ||
                dateRange.start === dateRange.end
            )
            : date === "") ||
        (!createMemo &&
            title.trim() === (data?.title ?? "") &&
            (endSelected ? dateRange.start : date) === (data?.start ?? "") &&
            (endSelected ? dateRange.end : "") === (data?.end ?? ""));

    const submitDateRangeMemo = async () => {
        setIsSending(true);
        const result = await addDateRangeMemoAction({ title, start: dateRange.start, end: dateRange.end })
        if (result.status !== 201) {
            toast.error(result.message)
        } else {
            toast.success(result.message)
            await onChanged?.(dateRange.start)
        }
        setIsMemoModalOpen(false)
        setIsSending(false);
    }

    const submitDateMemo = async () => {
        setIsSending(true);
        const result = await addDateMemoAction({ title, start: date })
        if (result.status !== 201) {
            toast.error(result.message)
        } else {
            toast.success(result.message)
            await onChanged?.(date)
        }
        setIsMemoModalOpen(false)
        setIsSending(false);
    }

    const editDateRangeMemo = async () => {
        if (!data?.id) {
            toast.error("수정할 메모를 찾을 수 없습니다.")
            return;
        }

        setIsSending(true);
        const result = await editDateRangeMemoAction({
            calendarId: data.id,
            title,
            start: dateRange.start,
            end: dateRange.end,
        })
        if (result.status !== 200) {
            toast.error(result.message)
        } else {
            toast.success(result.message)
            await onChanged?.(dateRange.start)
        }
        setIsMemoModalOpen(false)
        setIsSending(false);
    }

    const editDateMemo = async () => {
        if (!data?.id) {
            toast.error("수정할 메모를 찾을 수 없습니다.")
            return;
        }

        setIsSending(true);
        const result = await editDateMemoAction({
            calendarId: data.id,
            title,
            start: date,
        })
        if (result.status !== 200) {
            toast.error(result.message)
        } else {
            toast.success(result.message)
            await onChanged?.(date)
        }
        setIsMemoModalOpen(false)
        setIsSending(false);
    }

    const deleteMemo = async () => {
        if (!data?.id) {
            toast.error("삭제할 메모를 찾을 수 없습니다.")
            return;
        }

        setIsSending(true);
        const result = await deleteMemoAction({
            calendarId: data.id,
        })
        if (result.status !== 200) {
            toast.error(result.message)
        } else {
            toast.success(result.message)
            await onChanged?.(data.start)
        }
        setIsMemoModalOpen(false)
        setIsSending(false);
    }


    return (
        <div
            className="fixed inset-0 z-999999 flex items-center justify-center bg-black/40"
            onClick={() => setIsMemoModalOpen(false)}
        >
            <div
                className="w-90 rounded-xl border border-slate-200 bg-white p-5 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-row justify-between items-center mb-2">

                    <h2 className="text-lg font-bold text-slate-900">
                        {createMemo ? "메모 추가하기" : "메모 수정하기"}
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
                <div className="flex flex-row justify-between">
                    <div className="w-5 h-5 ml-1" />
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
                    {createMemo ? (
                        <div className="w-5 h-5 ml-1" />
                    ) : (
                        <DeleteModal
                            title={`${title} 삭제`}
                            description="삭제하면 복구할 수 없습니다."
                            onDelete={deleteMemo}
                            trigger={
                                <button className="text-sm text-red-500 mr-1">
                                    <Trash2 className="w-5 h-5 cursor-pointer" />
                                </button>
                            }
                        />
                    )}
                </div>
                <textarea
                    className="mt-4 h-32 w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-indigo-300"
                    placeholder="메모를 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />


                <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => setIsMemoModalOpen(false)}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100"
                    >
                        취소
                    </button>

                    <button
                        type="button"
                        className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white disabled:bg-indigo-300 cursor-pointer disabled:cursor-auto hover:bg-indigo-600"
                        disabled={disabled || isSending}
                        onClick={createMemo ? (endSelected ? submitDateRangeMemo : submitDateMemo) : (endSelected ? editDateRangeMemo : editDateMemo)}
                    >
                        {createMemo ? (isSending ? "추가 중..." : "추가하기") : (isSending ? "수정 중..." : "수정하기")}
                    </button>
                </div>
            </div>
        </div>
    );
}
