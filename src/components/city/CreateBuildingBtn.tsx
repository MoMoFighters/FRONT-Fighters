import Link from "next/link";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";

export default function CreateBuildingBtn() {
    return (
        <HoverCard openDelay={50} closeDelay={50}>
            <HoverCardTrigger asChild>
                <Link href="/student/lectures">
                    <div className="w-30 h-30 border-2 border-dashed rounded-lg border-slate-400 bg-slate-50
                flex justify-center items-center font-bold text-5xl text-slate-400 cursor-pointer
                hover:bg-slate-100 hover:border-slate-500 hover:scale-[1.02] hover:text-slate-500 transition-all ">+</div>
                </Link>
            </HoverCardTrigger>
            <HoverCardContent className="flex w-64 flex-col gap-0.5">
                <div className="font-bold text-slate-700 text-[14px]">강의 신청</div>
                <div className="text-slate-500 text-[12px]">새로운 강의를 수강하고 그에 맞는 건물을 건설하고, 성장시켜 보세요!</div>
            </HoverCardContent>
        </HoverCard>

    );
}