'use client'

import { Button } from "@/components/ui/button";
import { useState } from "react";
import LectureFormChapterItem from "./LectureFormChapterItem";

type LectureFormProps = {
    mode: 'create' | 'edit'
}
type Chapter = {
    index: number;
    title: string;
    video: string;
}

export default function LectureForm({ mode }: LectureFormProps) {

    const [chapterLength, setChapterLength] = useState(1);
    const [chapters, setChapters] = useState([{ index: 1, title: '', video: '' } as Chapter])
    const addChapterItem = () => {
        setChapterLength(chapterLength + 1)
        setChapters([
            ...chapters,
            { index: chapterLength + 1, title: '', video: '' }
        ])
    }

    return (
        <div className="flex flex-col justify-center align-middle">
            <div className="flex flex-col mx-4xl gap-3">
                <h1 className="text-3xl text-center font-bold">
                    {mode === 'create' ? "강의 등록" : "강의 수정"}
                </h1>
                <form
                    action=""
                    className="flex flex-col gap-4"
                >
                    <div className="grid grid-cols-[80_3fr] gap-4">
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
                    </div>
                    <div className="grid grid-cols-[80_3fr] gap-4">
                        <p className="text-right">강의 제목</p>
                        <input
                            type="text"
                            placeholder="강의 제목"
                            className="border-1 border-black px-2"
                        />
                    </div>
                    <div className="grid grid-cols-[80_3fr] gap-4">
                        <p className="text-right">강의 설명</p>
                        <textarea
                            placeholder="강의 설명"
                            className="border-1 border-black resize-none px-2"
                            rows={8}
                        >
                        </textarea>
                    </div>
                    <hr className="border border-black" />
                    <div className="grid grid-cols-[80_3fr] gap-4">
                        <p className="text-right py-auto">챕터 목록</p>
                        <div className="flex flex-row">
                            <div className="flex-1"></div>
                            {mode === 'create' ? (
                                <Button type='button' onClick={addChapterItem}>챕터 추가</Button>
                            ) : ""
                            }
                        </div>
                    </div>
                    {chapters.map((chapter) => (
                        <LectureFormChapterItem index={chapter.index} />
                    ))}
                </form>
            </div>
        </div>
    );
}