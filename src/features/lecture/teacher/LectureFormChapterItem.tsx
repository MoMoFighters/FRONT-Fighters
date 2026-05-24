import { Button } from "@/components/ui/button";

type Chapter = {
    index: number;
    title: string;
    video: string;
}

type LectureFormChapterItemProps = {
    chapter: Chapter;
    mode: 'create' | 'edit';
}

export default function LectureFormChapterItem({ chapter, mode }: LectureFormChapterItemProps) {

    const { index, title, video } = chapter;

    return (
        <div className="flex flex-col gap-3 border border-black p-3">{/* 나중에 컴포넌트화 (LectureFormChapterItem) */}
            <div className="flex flex-row">
                <p className="mr-auto">챕터{index}</p>
                <div className="flex-1"></div>
                {mode === 'create' ? (
                    <Button className="px-2 py-1" type="button">삭제하기</Button>
                ) : ""}
            </div>
            <div className="grid grid-cols-[80_1fr]">
                <p>챕터 제목</p>
                <input
                    type="text"
                    placeholder="챕터 제목을 입력하세요"
                    className="border border-black px-2 py-1"
                    defaultValue={title}
                    required
                />
            </div>
            <div className="grid grid-cols-[80_1fr]">
                <p>동영상</p>
                <input type="file" defaultValue={video} required />
            </div>
        </div>
    );
}