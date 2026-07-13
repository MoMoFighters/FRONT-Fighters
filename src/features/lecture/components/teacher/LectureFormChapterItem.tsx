"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadCloud } from "lucide-react";

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
    const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);

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

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (thumbnailPreviewUrl) {
            URL.revokeObjectURL(thumbnailPreviewUrl);
        }

        setThumbnailPreviewUrl(URL.createObjectURL(file));
    };

    return (
        <div className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm">
            <div className="flex items-center">
                <div>
                    <p className="text-base font-black text-slate-900">챕터 {index}</p>
                    <p className="mt-1 text-xs font-bold text-slate-400">
                        챕터 제목, 썸네일, 영상을 등록하세요.
                    </p>
                </div>
                <div className="ml-auto">
                    {mode === 'create' && (
                        <button
                            type="button"
                            onClick={() => onDelete(index)}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-lg font-bold text-rose-500 shadow-sm ring-1 ring-slate-200 transition hover:bg-rose-500 hover:text-white"
                        >
                            -
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
            <div className="grid grid-cols-[110px_1fr] items-center gap-4">
                <label className="text-sm font-black text-slate-700">챕터 제목 *</label>
                <input
                    type="text"
                    name={`chapterTitle_${index}`}
                    placeholder="챕터 제목을 입력하세요"
                    defaultValue={title}
                    required
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none placeholder:text-slate-400 transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                />
            </div>

            {/* 챕터썸네일 */}
            <div className="grid grid-cols-[110px_1fr] gap-4">
                <label className="pt-3 text-sm font-black text-slate-700">챕터 썸네일</label>

                <label className="flex min-h-32 max-w-80 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-indigo-200 bg-white p-4 transition hover:bg-indigo-50/60">
                    {thumbnailPreviewUrl ? (
                        <Image
                            src={thumbnailPreviewUrl}
                            alt={`챕터 ${index} 썸네일 미리보기`}
                            width={320}
                            height={160}
                            className="h-40 w-full rounded-xl object-cover"
                            unoptimized
                        />
                    ) : (
                        <div className="flex flex-col items-center">
                            <UploadCloud className="mb-2 h-9 w-9 text-slate-400" aria-hidden="true" />
                            <p className="text-sm font-black text-slate-500">챕터 썸네일 업로드</p>
                            <p className="mt-1 text-xs font-bold text-slate-400">선택 사항</p>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        name={`chapterThumbnail_${index}`}
                        className="hidden"
                        onChange={handleThumbnailChange}
                    />
                </label>
            </div>

            {/* 동영상 */}
            <div className="grid grid-cols-[110px_1fr] gap-4">
                <label className="pt-3 text-sm font-black text-slate-700">동영상 *</label>

                <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-indigo-200 bg-white p-4 transition hover:bg-indigo-50/60">
                    <input
                        type="file"
                        accept="video/*"
                        name={`video_${index}`}
                        className="hidden"
                        onChange={handleVideoChange}
                    />

                    {previewUrl ? (
                        <div className="flex w-full flex-col items-center gap-3">
                            <video src={previewUrl} controls className="max-h-56 w-full rounded-2xl" />
                            <p className="text-sm font-bold text-slate-600">{videoFile?.name}</p>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-400 hover:bg-slate-200">
                                동영상 변경하기
                            </span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <UploadCloud className="mb-2 h-10 w-10 text-slate-400" aria-hidden="true" />
                            <p className="text-sm font-black text-slate-500">동영상 업로드</p>
                        </div>
                    )}
                </label>
            </div>

            <p className="text-right text-xs font-black text-rose-500">
                *강의 영상은 챕터당 최대 500MB입니다.*
            </p>
        </div>
    );
}
