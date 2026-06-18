'use client'

import { Button } from "@/components/ui/button";
import { useActionState, useState } from "react";
import LectureFormChapterItem from "./LectureFormChapterItem";
import Image from "next/image";
import upload from '@/app/assets/img/fileUpload.svg'
import Link from "next/link";
import { createLectureWithChaptersAction } from "@/app/services/lecture/lectureCreateAction";

type LectureFormProps = {
    mode: 'create' | 'edit'
}

type Chapter = {
    id: number;
    index: number;
    title: string;
    video: string;
}

const MAX_CHAPTER_COUNT = 10;

export default function LectureForm({ mode }: LectureFormProps) {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [preview, setPreview] = useState<string | null>(null);

    const addChapterItem = () => {
        if (chapters.length >= MAX_CHAPTER_COUNT) {
            return;
        }

        setChapters(prev => [
            ...prev,
            {
                id: Date.now(),
                index: prev.length + 1,
                title: '',
                video: ''
            }
        ]);
    };

    const removeChapterItem = (index: number) => {
        const filtered = chapters.filter(chapter => chapter.index !== index);
        const reordered = filtered.map((chapter, idx) => ({
            ...chapter,
            index: idx + 1
        }));
        setChapters(reordered);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const preventUpload = chapters.length === 0;

    const [status, formAction, isPending] = useActionState(
        createLectureWithChaptersAction,
        { timestamp: '', status: 404, code: "", message: "", data: undefined }
    );

    return (
        <div className="mx-auto w-full max-w-300">
            <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm">
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-indigo-500 to-slate-900 px-8 py-7 text-white">
                    <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                    <div className="relative">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-100">
                            Teacher Studio
                        </p>
                        <h1 className="mt-3 text-3xl font-black tracking-tight">
                            {mode === 'create' ? "강의 등록" : "강의 수정"}
                        </h1>
                        <p className="mt-2 text-sm font-semibold text-indigo-100">
                            강의 기본 정보와 챕터 영상을 순서대로 등록하세요.
                        </p>
                    </div>
                </div>

                {/* ⚠️ [핵심 수정]: encType="multipart/form-data"를 추가하여 하위 비디오 파일 스트림이 온전히 전송되도록 보정합니다. */}
                {/* encType을 지워도 React가 내부적으로 자동으로 처리해 줍니다! */}
                <form className="flex flex-col gap-6 p-8" action={formAction}>

                    {/* 챕터 수 hidden input */}
                    <input type="hidden" name="chapterCount" value={chapters.length} />

                    {/* 썸네일 */}
                    <div className="grid grid-cols-[120px_1fr] gap-4">
                        <label className="pt-2 text-sm font-black text-slate-700">
                            대표 썸네일 *
                        </label>
                        <label className="flex h-52 max-w-110 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-indigo-200 bg-indigo-50/40 transition-colors hover:bg-indigo-50">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="썸네일 미리보기"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <>
                                    <Image src={upload} alt="업로드" width={40} height={40} className="mb-2 opacity-70" />
                                    <p className="text-sm font-black text-slate-500">이미지 업로드</p>
                                    <p className="mt-1 text-xs font-semibold text-slate-400">최대 5MB</p>
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                name="thumbnail"
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    {/* 카테고리 */}
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <label className="text-sm font-black text-slate-700">
                            카테고리 *
                        </label>
                        <select name="category" className="h-11 w-44 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100" required>
                            <option value="" disabled hidden>카테고리 선택</option>
                            <option value="STUDY">학습</option>
                            <option value="BEAUTY">뷰티</option>
                            <option value="FITNESS">헬스케어</option>
                            <option value="COOK">요리</option>
                            <option value="ART">예술</option>
                        </select>
                    </div>

                    {/* 강의 제목 */}
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <label className="text-sm font-black text-slate-700">
                            제목 *
                        </label>
                        <input
                            type="text"
                            name="title"
                            placeholder="강의 제목을 입력하세요"
                            required
                            className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold outline-none transition-all placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                        />
                    </div>

                    {/* 강의 설명 */}
                    <div className="grid grid-cols-[120px_1fr] gap-4">
                        <label className="pt-3 text-sm font-black text-slate-700">
                            강의 설명 *
                        </label>
                        <textarea
                            name="description"
                            placeholder="강의에 대한 설명을 입력하세요"
                            rows={7}
                            required
                            className="resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium leading-7 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                        />
                    </div>

                    <hr className="border-slate-100" />

                    {/* 챕터 목록 헤더 */}
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-lg font-black text-slate-950">챕터 목록</p>
                            <p className="mt-1 text-xs font-bold text-slate-400">
                                최대 {MAX_CHAPTER_COUNT}개까지 등록할 수 있습니다. 현재 {chapters.length}개
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {chapters.length >= MAX_CHAPTER_COUNT && (
                                <p className="text-xs font-black text-rose-500">
                                    최대 챕터 수에 도달했습니다.
                                </p>
                            )}
                            {mode === 'create' && (
                                <Button
                                    type='button'
                                    onClick={addChapterItem}
                                    disabled={chapters.length >= MAX_CHAPTER_COUNT}
                                    className="rounded-2xl bg-indigo-500 px-5 font-black text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                                >
                                    챕터 추가
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* 챕터 아이템 루프 렌더링 */}
                    {chapters.map((chapter) => (
                        <LectureFormChapterItem
                            key={chapter.id}
                            chapter={chapter}
                            mode={mode}
                            onDelete={removeChapterItem}
                        />
                    ))}

                    {chapters.length === 0 && (
                        <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center text-sm font-black text-rose-500">
                            *챕터는 최소 1개 이상이어야 합니다.*
                        </p>
                    )}

                    {/* 알림 메시지 분기 처리 */}
                    {status?.message && (
                        <p className={`text-center text-sm font-bold ${status.status === 201 ? 'text-green-600' : 'text-red-500'}`}>
                            {status.message}
                        </p>
                    )}

                    {/* 하단 제어 버튼 조절부 */}
                    <div className="flex flex-row gap-2">
                        <div className="flex-1" />
                        <Button type="button" asChild className="h-11 cursor-pointer rounded-2xl border border-slate-200 bg-white px-5 font-black text-slate-700 hover:bg-slate-50">
                            <Link href="/teacher/lectures">취소</Link>
                        </Button>
                        <Button
                            type="submit"
                            className="h-11 cursor-pointer rounded-2xl bg-slate-900 px-6 font-black text-white hover:bg-indigo-500"
                            disabled={preventUpload || isPending}
                        >
                            {isPending ? "등록 중..." : mode === 'create' ? "강의 등록" : "강의 수정"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
