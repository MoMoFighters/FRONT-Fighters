"use client";

import Image from "next/image";
import { useState, useRef } from "react";
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

    // 비디오 메타데이터 상태 관리
    const [duration, setDuration] = useState<number>(0);
    const [fileSize, setFileSize] = useState<number>(0);
    const [fileName, setFileName] = useState<string>("");

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setVideoFile(file);
        setFileSize(file.size);
        setFileName(file.name);

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // 비디오 재생 시간(duration) 추출을 위한 가상 엘리먼트 생성
        const videoElement = document.createElement("video");
        videoElement.src = objectUrl;
        videoElement.onloadedmetadata = () => {
            // 소수점 버림 처리하여 초 단위 정수로 저장
            setDuration(Math.floor(videoElement.duration));
        };
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

            {/* 💡 백엔드 동영상 API 스펙 대응을 위한 메타데이터 Hidden Inputs */}
            <input type="hidden" name={`videoSizeBytes_${index}`} value={fileSize} />
            <input type="hidden" name={`durationSec_${index}`} value={duration} />
            <input type="hidden" name={`originalFilename_${index}`} value={fileName} />

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

                <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white p-4 hover:bg-slate-50">
                    <input
                        type="file"
                        accept="video/*"
                        name={`video_${index}`}
                        className="hidden"
                        required={mode === 'create' && !videoFile}
                        onChange={handleVideoChange}
                    />

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