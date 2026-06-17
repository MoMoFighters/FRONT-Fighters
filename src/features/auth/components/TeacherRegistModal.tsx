'use client'

import { X } from "lucide-react";
import { useEffect, useState } from "react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function TeacherRegistModal({ isModal, setIsModal, nickName }: { isModal: boolean, setIsModal: any, nickName: string }) {

    const [category, setCategory] = useState("");
    const [previewFile, setPreviewFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            setPreviewFile(null);
            setPreviewUrl(null);
            return;
        }

        const isPdf = file.type === "application/pdf";
        const isMp4 = file.type === "video/mp4";

        if (!isPdf && !isMp4) {
            e.target.value = "";
            setPreviewFile(null);
            setPreviewUrl(null);
            alert("PDF 또는 MP4 파일만 업로드할 수 있습니다.");
            return;
        }

        setPreviewFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    if (!isModal) return (
        <div
            className='pr-2 px-1 pb-4 text-sm font-bold transition border-transparent text-slate-500 hover:text-slate-900 cursor-pointer'
            onClick={() => setIsModal(true)}
        >
            강사 등록
        </div>)

    return (
        <>
            <div
                className='pr-2 px-1 pb-4 text-sm font-bold transition border-transparent text-slate-500 hover:text-slate-900 cursor-pointer'
                onClick={() => setIsModal(false)}
            >
                강사 등록
            </div>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                onClick={() => setIsModal(false)}
            >
                <div
                    className="flex flex-col w-[60vw] h-[55vw] rounded-2xl border border-slate-200 bg-white px-6 pt-7 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-row items-center">
                        <h2 className="text-2xl font-bold text-slate-900">
                            강사 등록
                        </h2>
                        <div className="flex-1" />
                        <button
                            type="button"
                            className="text-slate-500 hover:text-slate-900 cursor-pointer"
                            onClick={() => setIsModal(false)}>
                            <X />
                        </button>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        강사 활동에 사용할 이름과 강의 분야, 인증 자료를 등록해 주세요.
                    </p>
                    <form className="mt-7 flex min-h-0 flex-1 flex-col overflow-hidden">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="teacherName"
                                    className="text-sm font-semibold text-slate-700"
                                >
                                    강사 활동명
                                </label>

                                <input
                                    type="text"
                                    id="teacherName"
                                    name="teacherName"
                                    placeholder="예: 모모쌤"
                                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-mauve-400 focus:bg-white focus:ring-4 focus:ring-mauve-100"
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="category"
                                    className="text-sm font-semibold text-slate-700"
                                >
                                    카테고리
                                </label>

                                <Select
                                    value={category}
                                    onValueChange={setCategory}
                                    name="category"
                                >
                                    <SelectTrigger
                                        id="category"
                                        className="!h-10 min-h-10 w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-0 text-sm text-slate-700 shadow-none focus:border-mauve-400 focus:bg-white focus:ring-4 focus:ring-mauve-100 [&>span]:leading-none"
                                    >
                                        <SelectValue placeholder="선택" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="FITNESS" className="!h-10">피트니스</SelectItem>
                                        <SelectItem value="ART" className="!h-10">예술</SelectItem>
                                        <SelectItem value="COOK" className="!h-10">요리</SelectItem>
                                        <SelectItem value="STUDY" className="!h-10">학습</SelectItem>
                                        <SelectItem value="FASHION" className="!h-10">패션</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <input
                            type="file"
                            id="proofFile"
                            name="proofFile"
                            accept="application/pdf,video/mp4"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
                            <label className="text-sm font-semibold text-slate-700">
                                인증 파일
                            </label>

                            {!previewFile || !previewUrl ? (
                                <label
                                    htmlFor="proofFile"
                                    className="flex min-h-0 flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-center transition-colors hover:border-mauve-300 hover:bg-mauve-50/50"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                                        <span className="text-xl font-bold text-mauve-500">
                                            +
                                        </span>
                                    </div>

                                    <p className="mt-3 text-sm font-semibold text-slate-700">
                                        파일 업로드하기
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        PDF 또는 MP4 파일 1개만 등록할 수 있습니다.
                                    </p>
                                </label>
                            ) : (
                                <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
                                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
                                        <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
                                            <p className="text-sm font-semibold text-slate-700">
                                                파일 미리보기
                                            </p>

                                            <p className="max-w-64 truncate text-xs font-medium text-slate-400">
                                                {previewFile.name}
                                            </p>
                                        </div>

                                        <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl bg-slate-50 text-sm text-slate-400">
                                            {previewFile.type === "application/pdf" ? (
                                                <iframe
                                                    src={previewUrl}
                                                    title="PDF 미리보기"
                                                    className="h-full w-full rounded-xl border-0"
                                                />
                                            ) : (
                                                <video
                                                    src={previewUrl}
                                                    controls
                                                    className="h-full w-full rounded-xl object-contain"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-row">
                                        <div className="flex-1" />
                                        <label
                                            htmlFor="proofFile"
                                            className="mr-2 flex shrink-0 cursor-pointer items-center justify-center text-sm font-semibold text-slate-400 transition-colors hover:text-slate-600"
                                        >
                                            파일 바꾸기
                                        </label>
                                    </div>

                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="my-4 h-12 w-full shrink-0 rounded-xl bg-indigo-500 text-base font-bold text-white shadow-sm transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                        // disabled={pending || notCompleted}
                        >
                            등록 요청하기
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}