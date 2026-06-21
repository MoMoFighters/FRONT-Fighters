"use client";

import { useState } from "react";

import { Lecture } from "@/features/lecture/type";
import AdminLectureApprovalActions from "./AdminLectureApprovalActions";
import AdminLectureItem from "./AdminLectureItem";

interface AdminLectureListProps {
    lectures: Lecture[];
    isPendingView?: boolean;
}

export default function AdminLectureList({
    lectures,
    isPendingView = false,
}: AdminLectureListProps) {
    const [selectedLectureIds, setSelectedLectureIds] = useState<number[]>([]);
    const selectableLectures = lectures.filter((lecture) => lecture.lectureStatus === "WAITING");
    const isAllSelected = selectableLectures.length > 0 && selectedLectureIds.length === selectableLectures.length;

    const toggleAll = (selected: boolean) => {
        setSelectedLectureIds(selected ? selectableLectures.map((lecture) => lecture.lectureId) : []);
    };

    const toggleLecture = (lectureId: number, selected: boolean) => {
        setSelectedLectureIds((current) => selected
            ? [...current, lectureId]
            : current.filter((id) => id !== lectureId));
    };

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {isPendingView && (
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-600">
                        <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={(event) => toggleAll(event.target.checked)}
                            className="size-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-200"
                        />
                        전체 선택
                    </label>
                    <AdminLectureApprovalActions lectureIds={selectedLectureIds} bulk />
                </div>
            )}
            {lectures.map((lecture) => (
                <AdminLectureItem
                    key={lecture.lectureId}
                    lecture={lecture}
                    selectable={isPendingView && lecture.lectureStatus === "WAITING"}
                    selected={selectedLectureIds.includes(lecture.lectureId)}
                    onSelectedChange={toggleLecture}
                />
            ))}
        </section>
    );
}
