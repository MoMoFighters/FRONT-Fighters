'use client'


import { Button } from "@/components/ui/button";
import { useState } from "react";
import LectureFormChapterItem from "./LectureFormChapterItem";
import Image from "next/image";
import upload from '@/app/assets/img/fileUpload.svg'

type LectureFormProps = {
    mode: 'create' | 'edit'
}
type Chapter = {
    index: number;
    title: string;
    video: string;
}

export default function LectureForm({ mode }: LectureFormProps) {

    const [chapterLength, setChapterLength] = useState<number>(1);
    const [chapters, setChapters] = useState([{ index: 1, title: 'asd', video: '' } as Chapter])
    const addChapterItem = () => {
        setChapterLength(chapterLength + 1)
        setChapters([
            ...chapters,
            { index: chapterLength + 1, title: '', video: '' }
        ])
    }


    const [preview, setPreview] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };




    return (
        <div className="flex flex-col justify-center align-middle">
            <div className="flex flex-col mx-4xl gap-3">
                <h1 className="text-3xl text-center font-bold mb-4">
                    {mode === 'create' ? "강의 등록" : "강의 수정"}
                </h1>
                <form
                    action=""
                    className="flex flex-col gap-4"
                >
                    {/* <div className="grid grid-cols-[80_3fr] gap-4">
                        <p className="text-right">썸네일</p>
                        <div className="w-100% h-30 border border-black">

                        </div>
                        <div></div>
                        <Button variant="default" type="button">
                            <input
                                type="file"
                                accept="image"
                                required
                            />
                        </Button>
                    </div> */}
                    <div className="grid grid-cols-[80px_3fr] gap-4">
                        <p className="text-right font-bold">썸네일</p>
                        <label className="flex flex-col items-center justify-center w-md h-63 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer">
                            {preview ? (
                                <img src={preview} alt="썸네일 미리보기" className="h-full object-contain" />
                            ) : (
                                <>
                                    <span className="text-3xl text-gray-400"><Image src={upload} alt='업로드'></Image></span>
                                    <span className="text-gray-400">이미지 업로드</span>
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleChange}
                            />
                        </label>
                        <div className="w-full"></div>
                    </div>
                    <div className="grid grid-cols-[80_3fr] gap-4">
                        <p className="text-right font-bold">강의 제목</p>
                        <input
                            type="text"
                            placeholder="강의 제목"
                            className="border border-black px-2 py-1"
                        />
                    </div>
                    <div className="grid grid-cols-[80_3fr] gap-4">
                        <p className="text-right font-bold">강의 설명</p>
                        <textarea
                            placeholder="강의 설명"
                            className="border border-black resize-none px-2 py-2"
                            rows={8}
                        >
                        </textarea>
                    </div>
                    <hr className="border border-black" />
                    <div className="grid grid-cols-[80_3fr] gap-4">
                        <p className="text-left font-bold py-auto">챕터 목록</p>
                        <div className="flex flex-row">
                            <div className="flex-1"></div>
                            {mode === 'create' ? (
                                <Button type='button' onClick={addChapterItem}>챕터 추가</Button>
                            ) : ""
                            }
                        </div>
                    </div>
                    {chapters.map((chapter) => (
                        <LectureFormChapterItem chapter={chapter} mode={mode} key={chapter.index || 1} />
                    ))}
                    <Button>
                        {mode === 'create' ? "강의 등록" : "강의 수정"}
                    </Button>
                </form>
            </div>
        </div>
    );
}