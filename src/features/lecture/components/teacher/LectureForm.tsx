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

export default function LectureForm({ mode }: LectureFormProps) {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [preview, setPreview] = useState<string | null>(null);

    const addChapterItem = () => {
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
        <div className="flex flex-col justify-center align-middle">
            <div className="flex flex-col gap-3">
                <p className="mb-4 text-center text-3xl font-bold">
                    {mode === 'create' ? "강의 등록" : "강의 수정"}
                </p>

                {/* ⚠️ [핵심 수정]: encType="multipart/form-data"를 추가하여 하위 비디오 파일 스트림이 온전히 전송되도록 보정합니다. */}
                {/* encType을 지워도 React가 내부적으로 자동으로 처리해 줍니다! */}
                <form className="flex flex-col gap-4" action={formAction}>

                    {/* 챕터 수 hidden input */}
                    <input type="hidden" name="chapterCount" value={chapters.length} />

                    {/* 썸네일 */}
                    <div className="grid grid-cols-[90px_1fr] gap-3">
                        <label className="pt-2 text-sm font-semibold text-slate-700">
                            썸네일 *
                        </label>
                        <label className="flex h-48 w-97.5 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white transition-colors hover:bg-slate-50">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="썸네일 미리보기"
                                    className="h-full w-full rounded-xl object-cover"
                                />
                            ) : (
                                <>
                                    <Image src={upload} alt="업로드" width={40} height={40} className="mb-2 opacity-70" />
                                    <p className="text-sm font-medium text-slate-500">이미지 업로드</p>
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
                    <p className="mt-[-10] ml-80 text-red-400 text-sm font-bold">
                        *썸네일은 최대 5MB입니다*
                    </p>

                    {/* 카테고리 */}
                    <div className="grid grid-cols-[90px_1fr] items-center gap-3">
                        <label className="text-sm font-semibold text-slate-700">
                            카테고리 *
                        </label>
                        <select name="category" className="w-36 border-slate-900 border" required>
                            <option value="" disabled hidden>카테고리 선택</option>
                            <option value="STUDY">학습</option>
                            <option value="BEAUTY">뷰티</option>
                            <option value="FITNESS">헬스케어</option>
                            <option value="COOK">요리</option>
                            <option value="ART">예술</option>
                        </select>
                    </div>

                    {/* 강의 제목 */}
                    <div className="grid grid-cols-[90px_1fr] items-center gap-3">
                        <label className="text-sm font-semibold text-slate-700">
                            제목 *
                        </label>
                        <input
                            type="text"
                            name="title"
                            placeholder="강의 제목을 입력하세요"
                            required
                            className="h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-slate-500"
                        />
                    </div>

                    {/* 강의 설명 */}
                    <div className="grid grid-cols-[90px_1fr] gap-3">
                        <label className="pt-3 text-sm font-semibold text-slate-700">
                            강의 설명 *
                        </label>
                        <textarea
                            name="description"
                            placeholder="강의에 대한 설명을 입력하세요"
                            rows={7}
                            required
                            className="resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-slate-500"
                        />
                    </div>

                    <hr className="border border-slate-200" />

                    {/* 챕터 목록 헤더 */}
                    <div className="grid grid-cols-[80px_3fr] gap-4">
                        <p className="py-auto text-left font-bold">챕터 목록</p>
                        <div className="flex flex-row">
                            <div className="flex-1" />
                            {mode === 'create' && (
                                <Button type='button' onClick={addChapterItem}>
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
                        <p className="text-right mr-2 text-sm text-red-500 font-bold">
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
                        <Button type="button" asChild className="h-10 rounded-sm border border-black bg-slate-50 px-4 text-slate-900 cursor-pointer hover:bg-slate-100">
                            <Link href="/teacher/lectures">취소</Link>
                        </Button>
                        <Button
                            type="submit"
                            className="h-10 rounded-sm border border-mauve-500 bg-mauve-500 px-4 text-slate-50 cursor-pointer"
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