'use client'

import { Button } from "@/components/ui/button";
import { useState } from "react";
import LectureFormChapterItem from "./LectureFormChapterItem";
import Image from "next/image";
import upload from '@/app/assets/img/fileUpload.svg'
import Link from "next/link";

type LectureFormProps = {
    mode: 'create' | 'edit'
}

type Chapter = {
    id: number;
    index: number;
    title: string;
    video: string;
}

export default function LectureForm({ mode }: LectureFormProps) {

    // 수정일때 data-fetching 받아와서 넣어두기
    const [chapters, setChapters] = useState<Chapter[]>([
        {
            id: 1,
            index: 1,
            title: 'asd',
            video: ''
        }
    ]);

    // 챕터 추가
    const addChapterItem = () => {
        setChapters(prev => [
            ...prev,
            {
                id: Date.now(), // 고유값
                index: prev.length + 1,
                title: '',
                video: ''
            }
        ]);
    };

    // 챕터 삭제
    const removeChapterItem = (index: number) => {
        const filtered = chapters.filter(
            chapter => chapter.index !== index
        );
        const reordered = filtered.map((chapter, idx) => ({
            ...chapter,
            index: idx + 1
        }));
        setChapters(reordered);
    };

    const [preview, setPreview] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="flex flex-col justify-center align-middle">
            <div className="flex flex-col gap-3">
                <p className="mb-4 text-center text-3xl font-bold">
                    {mode === 'create' ? "강의 등록" : "강의 수정"}
                </p>
                <form className="flex flex-col gap-4">
                    <div className="grid grid-cols-[90px_1fr] gap-3">
                        <label className="pt-2 text-sm font-semibold text-slate-700">
                            썸네일 *
                        </label>
                        <label
                            className="flex h-48 w-97.5 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white transition-colors hover:bg-slate-50"
                        >
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="썸네일 미리보기"
                                    className="h-full w-full rounded-xl object-cover"
                                />
                            ) : (
                                <>
                                    <Image
                                        src={upload}
                                        alt="업로드"
                                        width={40}
                                        height={40}
                                        className="mb-2 opacity-70"
                                    />

                                    <p className="text-sm font-medium text-slate-500">
                                        이미지 업로드
                                    </p>
                                </>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    {/* 강의 제목 */}
                    <div className="grid grid-cols-[90px_1fr] items-center gap-3">
                        <label className="text-sm font-semibold text-slate-700">
                            제목 *
                        </label>

                        <input
                            type="text"
                            placeholder="강의 제목을 입력하세요"
                            className="h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-slate-500"
                        />
                    </div>

                    {/* 강의 설명 */}
                    <div className="grid grid-cols-[90px_1fr] gap-3">
                        <label className="pt-3 text-sm font-semibold text-slate-700">
                            강의 설명
                        </label>

                        <textarea
                            placeholder="강의에 대한 설명을 입력하세요"
                            rows={7}
                            className="resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-slate-500"
                        />
                    </div>

                    <hr className="border border-slate-200" />

                    <div className="grid grid-cols-[80px_3fr] gap-4">
                        <p className="py-auto text-left font-bold">
                            챕터 목록
                        </p>
                        <div className="flex flex-row">
                            <div className="flex-1"></div>
                            {mode === 'create' && (
                                <Button
                                    type='button'
                                    onClick={addChapterItem}
                                >
                                    챕터 추가
                                </Button>
                            )}
                        </div>
                    </div>

                    {chapters.map((chapter) => (
                        <LectureFormChapterItem
                            key={chapter.index}
                            chapter={chapter}
                            mode={mode}
                            onDelete={removeChapterItem}
                        />
                    ))}
                    <div className="flex flex-row gap-2">
                        <div className="flex-1"></div>
                        <Button className="h-10 rounded-sm border border-black bg-slate-50 px-4 text-slate-900 cursor-pointer">
                            <Link href="/teacher/lectures">
                                취소
                            </Link>
                        </Button>

                        <Button className="h-10 rounded-sm border border-mauve-500 bg-mauve-500 px-4 text-slate-50 cursor-pointer">
                            {mode === 'create' ? "강의 등록" : "강의 수정"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}