"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import LectureForm from "./LectureForm";
import { useLectureCreateUpload } from "./LectureCreateUploadContext";

export default function LectureCreateFloatingWidget() {
    const { tasks, cancelUpload, removeTask } = useLectureCreateUpload();
    const [isOpen, setIsOpen] = useState(false);
    const uploadingTasks = useMemo(
        () => tasks.filter((task) => task.status === "uploading"),
        [tasks]
    );
    const completedTasks = useMemo(
        () => tasks.filter((task) => task.status === "completed"),
        [tasks]
    );
    const failedTasks = useMemo(
        () => tasks.filter((task) => task.status === "failed"),
        [tasks]
    );
    const hasTasks = tasks.length > 0;

    return (
        <>
            <div className="fixed bottom-8 right-8 z-[100] flex w-72 flex-col gap-2">
                {hasTasks && (
                    <div className="max-h-[50vh] space-y-2 overflow-y-auto rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-2xl backdrop-blur">
                        {uploadingTasks.map((task) => (
                            <div
                                key={task.id}
                                className="rounded-xl border border-indigo-100 bg-indigo-50 p-3"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <p className="min-w-0 truncate text-sm font-black text-slate-800">
                                        {task.title}
                                    </p>
                                    <div className="flex shrink-0 items-center gap-2">
                                        <span className="text-xs font-black text-indigo-500">
                                            {task.progress}%
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => cancelUpload(task.id)}
                                            className="rounded-full bg-white px-2 py-1 text-[10px] font-black text-slate-500 transition hover:bg-rose-50 hover:text-rose-500"
                                        >
                                            취소
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                                    <div
                                        className="h-full rounded-full bg-indigo-500 transition-all"
                                        style={{ width: `${task.progress}%` }}
                                    />
                                </div>
                            </div>
                        ))}

                        {completedTasks.map((task) => (
                            <div
                                key={task.id}
                                className="flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3"
                            >
                                <Link
                                    href={`/teacher/lectures/${task.lectureId}`}
                                    className="min-w-0 flex-1 transition hover:opacity-80"
                                >
                                    <p className="text-xs font-black text-emerald-600">
                                        등록 완료
                                    </p>
                                    <p className="mt-1 truncate text-sm font-black text-slate-800">
                                        {task.title}
                                    </p>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => removeTask(task.id)}
                                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-white hover:text-rose-500"
                                    aria-label="완료 항목 삭제"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}

                        {failedTasks.map((task) => (
                            <div
                                key={task.id}
                                className="flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 p-3"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-black text-rose-500">
                                        등록 실패
                                    </p>
                                    <p className="mt-1 truncate text-sm font-black text-slate-800">
                                        {task.title}
                                    </p>
                                    {task.errorMessage && (
                                        <p className="mt-1 truncate text-[11px] font-semibold text-rose-400">
                                            {task.errorMessage}
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeTask(task.id)}
                                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-white hover:text-rose-500"
                                    aria-label="실패 항목 삭제"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="ml-auto inline-flex h-12 items-center justify-center gap-2 rounded-full bg-indigo-500 px-5 text-sm font-black text-white shadow-2xl transition hover:bg-indigo-600"
                >
                    <Plus className="h-4 w-4" />
                    강의등록
                </button>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 z-[101] flex items-center justify-center bg-black/50 p-8"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="max-h-full w-full max-w-5xl overflow-y-auto rounded-3xl bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="sticky top-0 z-10 flex justify-end bg-white/90 p-4 backdrop-blur">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="px-8 pb-8">
                            <LectureForm
                                mode="create"
                                onUploadStart={() => setIsOpen(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
