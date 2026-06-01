"use client";

import Image from "next/image";
import { useState } from "react";
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

export default function LectureFormChapterItem({ chapter, mode, onDelete }: LectureFormChapterItemProps) {
    const { index, title } = chapter;

    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setVideoFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    return (
        <div className="flex flex-col gap-4 rounded-xl border border-slate-300 bg-slate-100 p-5">
            <div className="flex items-center">
                <p className="text-base font-bold text-slate-800">챕터 {index}</p>
                <div className="ml-auto">
                    {mode === 'create' && (
                        <button
                            type="button"
                            onClick={() => onDelete(index)}
                            className="text-lg font-bold text-red-500 hover:text-red-700 cursor-pointer"
                        >
                            [-]
                        </button>
                    )}
                </div>
            </div>

            {/* orderNo hidden - 챕터 순서를 index로 서버에 전달 */}
            <input type="hidden" name={`orderNo_${index}`} value={index} />

            {/* 챕터 제목 */}
            <div className="grid grid-cols-[90px_1fr] items-center gap-3">
                <label className="text-sm font-medium text-slate-700">챕터 제목 *</label>
                <input
                    type="text"
                    name={`chapterTitle_${index}`}
                    placeholder="챕터 제목을 입력하세요"
                    defaultValue={title}
                    required
                    className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none placeholder:text-slate-400 focus:border-slate-500"
                />
            </div>

            {/* 동영상 */}
            <div className="grid grid-cols-[90px_1fr] gap-3">
                <label className="pt-3 text-sm font-medium text-slate-700">동영상 *</label>

                {/* 💡 보완: 전체 영역을 감싸는 label 배치 */}
                <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white p-4 hover:bg-slate-50">

                    {/* ⚠️ [핵심 수정] input 태그를 조건부 렌더링 밖으로 빼서 폼 전송 시 항상 파일이 유지되도록 함 */}
                    <input
                        type="file"
                        accept="video/*"
                        name={`video_${index}`}
                        className="hidden"
                        required={mode === 'create' && !videoFile}
                        onChange={handleVideoChange}
                    />

                    {/* 내부 UI 구성 요소만 조건부 토글 */}
                    {previewUrl ? (
                        <div className="flex w-full flex-col items-center gap-3">
                            <video src={previewUrl} controls className="max-h-48 w-full rounded-md" />
                            <p className="text-sm text-slate-600 font-medium">{videoFile?.name}</p>
                            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">
                                동영상 변경하기
                            </span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <Image src={upload} alt="업로드" width={40} height={40} className="mb-2" />
                            <p className="text-sm font-medium text-slate-500">동영상 업로드</p>
                        </div>
                    )}
                </label>
            </div>

            <p className="text-right mr-2 text-sm text-red-500 font-bold">
                *강의 영상은 챕터당 최대 500MB입니다.*
            </p>
        </div>
    );
}