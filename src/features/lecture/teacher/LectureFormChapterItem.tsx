"use client";

import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import upload from "@/app/assets/img/fileUpload.svg";

type Chapter = {
    id: number;
    index: number;
    title: string;
    video: string;
}

type LectureFormChapterItemProps = {
    chapter: Chapter;
    mode: 'create' | 'edit';
    onDelete: (index: number) => void;
}

export default function LectureFormChapterItem({
    chapter,
    mode,
    onDelete,
}: LectureFormChapterItemProps) {
    const { index, title } = chapter;

    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleVideoChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setVideoFile(file);

        // 영상 미리보기 URL 생성
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    return (
        <div className="flex flex-col gap-4 rounded-xl border border-slate-300 bg-slate-100 p-5">
            <div className="flex items-center">
                <p className="text-base font-bold text-slate-800">
                    챕터 {index}
                </p>
                <div className="ml-auto">
                    {mode === 'create' && (
                        <button
                            type="button"
                            onClick={() => onDelete(index)}
                            className="text-lg font-bold text-red-500 hover:text-red-700"
                        >
                            [-]
                        </button>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-[90px_1fr] items-center gap-3">
                <label className="text-sm font-medium text-slate-700">
                    챕터 제목 *
                </label>

                <input
                    type="text"
                    placeholder="챕터 제목을 입력하세요"
                    defaultValue={title}
                    required
                    className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none placeholder:text-slate-400 focus:border-slate-500"
                />
            </div>
            <div className="grid grid-cols-[90px_1fr] gap-3">
                <label className="pt-3 text-sm font-medium text-slate-700">
                    동영상 *
                </label>

                <label
                    className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white p-4 hover:bg-slate-50"
                >
                    <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        required
                        onChange={handleVideoChange}
                    />

                    {previewUrl ? (
                        <div className="flex w-full flex-col items-center gap-3">
                            {/* 영상 미리보기 */}
                            <video
                                src={previewUrl}
                                controls
                                className="max-h-48 w-full rounded-md"
                            />
                            {/* 파일 이름 */}
                            <p className="text-sm text-slate-600">
                                {videoFile?.name}
                            </p>
                        </div>
                    ) : (
                        <>
                            <Image
                                src={upload}
                                alt="업로드"
                                width={40}
                                height={40}
                                className="mb-2"
                            />

                            <p className="text-sm font-medium text-slate-500">
                                동영상 업로드
                            </p>
                        </>
                    )}
                </label>
            </div>
        </div>
    );
}