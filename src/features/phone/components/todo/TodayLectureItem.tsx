import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import Link from "next/link";

// props : lectureId , lectureTitle , chapterTitle , category
export default function TodayLectureItem() {
    // props로 수정
    const info = {
        lectureId: 1,
        lectureTitle: '강의의 제목',
        chapterTitle: '챕터의 제목 챕터의 제목 챕터의 제목 챕터의 제목 챕터의 제목 챕터의 제목 챕터의 제목 챕터의 제목',
        category: "STUDY"
    }

    const link = `/student/${info.category.toLowerCase()}/lectures/${info.lectureId}`;

    return (
        <HoverCard
            openDelay={50}
            closeDelay={50}
        >
            <HoverCardTrigger asChild>
                <Link href={link}>
                    <div
                        className='bg-indigo-50/50 hover:bg-indigo-50/80 min-w-0 w-full h-14 rounded-md p-2 flex flex-col justify-center hover:-translate-y-0.5 cursor-pointer'
                    >
                        <h3 className="truncate text-md font-bold">{info.lectureTitle}</h3>
                        <p className="truncate text-[12px]">{info.chapterTitle}</p>
                    </div>
                </Link>
            </HoverCardTrigger>
            <HoverCardContent
                side="left"
                align="center"
                sideOffset={8}
            >
                <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">
                        {info.lectureTitle}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                        클릭하면 해당 강의로 이동합니다.
                    </p>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}