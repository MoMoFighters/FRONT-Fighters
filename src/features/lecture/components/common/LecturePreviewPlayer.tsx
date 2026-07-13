interface LecturePreviewPlayerProps {
    title: string;
    durationSec: number;
    videoUrl: string;
    currentChapterNo: number;
    totalChapterCount: number;
}

export default function LecturePreviewPlayer({
    title,
    durationSec,
    videoUrl,
    currentChapterNo,
    totalChapterCount
}: LecturePreviewPlayerProps) {

    return (
        <div className="flex flex-col">

            <video
                controls
                className="
                    w-160 h-90
                    rounded-tl-lg
                    rounded-tr-lg
                    bg-black
                "
            >
                <source
                    src={videoUrl}
                    type="video/mp4"
                />

                브라우저가 video 태그를 지원하지 않습니다.
            </video>

            <div
                className="
                    flex-1
                    bg-slate-500
                    border
                    rounded-bl-lg
                    rounded-br-lg
                    px-10
                    pt-8
                "
            >
                <p
                    className="
                        text-slate-50
                        font-bold
                        text-xl
                        mb-3
                    "
                >
                    {title}
                </p>

                <p
                    className="
                        text-slate-200
                        font-bold
                        text-sm
                    "
                >
                    {`${String(
                        Math.floor(durationSec / 60)
                    ).padStart(2, '0')}:${String(
                        durationSec % 60
                    ).padStart(2, '0')}`}
                    {" "}· 챕터 : {currentChapterNo}/{totalChapterCount}
                </p>
            </div>

        </div>
    );
}